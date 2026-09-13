import assert from 'node:assert/strict';
import { createServer, request } from 'node:http';
import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createLocalAdminMiddleware, createLocalAdminPlugin } from './local-admin.mjs';

const evidenceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../takhaial-site-evidence');

async function fixture(t, options) {
  await mkdir(evidenceRoot, { recursive: true });
  const root = await mkdtemp(path.join(evidenceRoot, 'admin-tests-'));
  const middleware = createLocalAdminMiddleware(root, options);
  const server = createServer((req, res) => middleware(req, res, () => {
    res.writeHead(404); res.end('Not found');
  }));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const origin = `http://127.0.0.1:${port}`;
  t.after(async () => {
    await new Promise(resolve => server.close(resolve));
    const resolved = path.resolve(root);
    assert.equal(path.dirname(resolved), evidenceRoot);
    assert.match(path.basename(resolved), /^admin-tests-/);
    await rm(resolved, { recursive: true, force: true });
  });
  async function call(route, { method = 'GET', data, rawBody, cookie, originHeader = origin, headers = {} } = {}) {
    return new Promise((resolve, reject) => {
      const body = rawBody ?? (data === undefined ? undefined : JSON.stringify(data));
      const outgoing = { ...headers };
      if (originHeader !== null) outgoing.Origin = originHeader;
      if (cookie) outgoing.Cookie = cookie;
      if (body !== undefined) outgoing['Content-Type'] = 'application/json';
      const req = request({ hostname: '127.0.0.1', port, path: route, method, headers: outgoing }, res => {
        let raw = '';
        res.setEncoding('utf8'); res.on('data', part => { raw += part; });
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: raw ? JSON.parse(raw) : null }));
      });
      req.on('error', reject); req.end(body);
    });
  }
  return { root, call, origin, server };
}

function cookieOf(response) { return response.headers['set-cookie'][0].split(';')[0]; }
const password = 'local-test-passphrase-2026';

test('public reads are allowlisted; unauthenticated writes and hostile origins fail', async t => {
  const { call } = await fixture(t);
  assert.deepEqual((await call('/api/takhaial/content')).body, { settings: {} });
  assert.deepEqual((await call('/api/takhaial/session')).body, { authenticated: false, setupRequired: true });
  assert.equal((await call('/api/takhaial/content', { method: 'PUT', data: { settings: { heroTitle: 'Bad' } } })).status, 401);
  for (const originHeader of [null, 'https://evil.example', 'http://localhost:9911', 'null']) {
    assert.equal((await call('/api/takhaial/setup', { method: 'POST', data: { password }, originHeader })).status, 403);
  }
  assert.equal((await call('/api/takhaial/session', { headers: { Host: 'evil.example' } })).status, 403);
  assert.equal((await call('/api/takhaial/session', { headers: { 'X-Forwarded-For': '203.0.113.5' } })).status, 403);
  assert.equal((await call('/api/takhaial/setup', { method: 'POST', data: { password }, headers: { 'Sec-Fetch-Site': 'cross-site' } })).status, 403);
  assert.equal((await call('/.local/admin.json')).status, 404);
  assert.equal((await call('/@fs/F:/anything/%2elocal/admin.json?raw')).status, 404);
});

test('setup persists only scrypt credentials; session login/logout and content survive restart', async t => {
  const { call, root } = await fixture(t);
  assert.equal((await call('/api/takhaial/setup', { method: 'POST', data: { password: 'short' } })).status, 400);
  const setup = await call('/api/takhaial/setup', { method: 'POST', data: { password } });
  assert.equal(setup.status, 201);
  assert.match(setup.headers['set-cookie'][0], /HttpOnly/);
  assert.match(setup.headers['set-cookie'][0], /SameSite=Strict/);
  assert.match(setup.headers['set-cookie'][0], /Max-Age=1800/);
  const persisted = JSON.parse(await readFile(path.join(root, '.local/admin.json'), 'utf8'));
  assert.equal(persisted.algorithm, 'scrypt');
  assert.match(persisted.salt, /^[a-f0-9]{64}$/);
  assert.match(persisted.hash, /^[a-f0-9]{128}$/);
  assert.equal(JSON.stringify(persisted).includes(password), false);
  assert.deepEqual(Object.keys(persisted).sort(), ['algorithm', 'hash', 'salt', 'version']);
  let cookie = cookieOf(setup);
  assert.equal((await call('/api/takhaial/session', { cookie })).body.authenticated, true);
  assert.equal((await call('/api/takhaial/setup', { method: 'POST', data: { password: 'another-long-password' } })).status, 409);
  const settings = { heroTitle: 'Work moves forward.', heroDescription: 'Connect your tools with reviewed workflows.', contactEmail: 'info@takhaialtech.com' };
  assert.deepEqual((await call('/api/takhaial/content', { method: 'PUT', cookie, data: { settings } })).body, { settings });
  assert.deepEqual((await call('/api/takhaial/content')).body, { settings });
  assert.deepEqual(JSON.parse(await readFile(path.join(root, '.local/content.json'), 'utf8')), { settings });
  const logout = await call('/api/takhaial/logout', { method: 'POST', cookie });
  assert.equal(logout.status, 200);
  assert.match(logout.headers['set-cookie'][0], /Max-Age=0/);
  assert.equal((await call('/api/takhaial/session', { cookie })).body.authenticated, false);
  assert.equal((await call('/api/takhaial/login', { method: 'POST', data: { password: 'wrong-but-long-password' } })).status, 401);
  const login = await call('/api/takhaial/login', { method: 'POST', data: { password } });
  assert.equal(login.status, 200); cookie = cookieOf(login);
  assert.equal((await call('/api/takhaial/session', { cookie })).body.authenticated, true);

  const restarted = createLocalAdminMiddleware(root);
  const restartServer = createServer((req, res) => restarted(req, res, () => res.end()));
  await new Promise(resolve => restartServer.listen(0, '127.0.0.1', resolve));
  try {
    const base = `http://127.0.0.1:${restartServer.address().port}`;
    const session = await (await fetch(`${base}/api/takhaial/session`, { headers: { Cookie: cookie } })).json();
    assert.deepEqual(session, { authenticated: false, setupRequired: false });
    assert.deepEqual(await (await fetch(`${base}/api/takhaial/content`)).json(), { settings });
    assert.equal((await fetch(`${base}/api/takhaial/login`, { method: 'POST', headers: { Origin: base, 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })).status, 200);
  } finally { await new Promise(resolve => restartServer.close(resolve)); }
});

test('content rejects extra fields, HTML, invalid email and excessive strings', async t => {
  const { call } = await fixture(t);
  const setup = await call('/api/takhaial/setup', { method: 'POST', data: { password } });
  const cookie = cookieOf(setup);
  const invalid = [
    { settings: { unknown: 'value' } }, { settings: { heroTitle: '<script>alert(1)</script>' } },
    { settings: { heroTitle: 'a'.repeat(141) } }, { settings: { heroDescription: 'a'.repeat(601) } },
    { settings: { contactEmail: 'not-an-email' } }, { settings: { heroTitle: 123 } },
    { settings: {}, password: 'not-allowed' }, { settings: [] }, { heroTitle: 'wrong shape' },
    JSON.parse('{"settings":{"__proto__":{"polluted":true}}}'),
  ];
  for (const data of invalid) assert.equal((await call('/api/takhaial/content', { method: 'PUT', data, cookie })).status, 400);
  assert.deepEqual((await call('/api/takhaial/content')).body, { settings: {} });
  assert.equal((await call('/api/takhaial/content', { method: 'PUT', data: { settings: {} }, cookie })).status, 200);
});

test('sessions expire at thirty minutes and setup cannot race', async t => {
  let now = 1_700_000_000_000;
  const { call } = await fixture(t, { now: () => now });
  const results = await Promise.all([1, 2].map(() => call('/api/takhaial/setup', { method: 'POST', data: { password } })));
  assert.deepEqual(results.map(r => r.status).sort(), [201, 409]);
  const cookie = cookieOf(results.find(r => r.status === 201));
  now += 30 * 60 * 1000;
  assert.equal((await call('/api/takhaial/session', { cookie })).body.authenticated, false);
});

test('plugin constrains dev and preview to loopback and registers middleware', () => {
  const plugin = createLocalAdminPlugin(evidenceRoot);
  const config = plugin.config();
  assert.equal(config.server.host, '127.0.0.1');
  assert.equal(config.preview.host, '127.0.0.1');
  assert.ok(config.server.fs.deny.includes('**/.local/**'));
  let middleware;
  plugin.configureServer({ config: { server: { host: '127.0.0.1' } }, middlewares: { use: handler => { middleware = handler; } } });
  assert.equal(typeof middleware, 'function');
  assert.throws(() => plugin.configurePreviewServer({ config: { preview: { host: '0.0.0.0' } } }), /loopback/i);
});

test('malformed and oversized JSON are rejected; login attempts are rate-limited', async t => {
  const { call } = await fixture(t);
  assert.equal((await call('/api/takhaial/setup', { method: 'POST', rawBody: '{bad-json' })).status, 400);
  assert.equal((await call('/api/takhaial/setup', { method: 'POST', data: { password: 'a'.repeat(5000) } })).status, 413);
  assert.equal((await call('/api/takhaial/setup', { method: 'POST', data: { password } })).status, 201);
  const results = [];
  for (let index = 0; index < 9; index += 1) results.push((await call('/api/takhaial/login', { method: 'POST', data: { password: 'deliberately-incorrect' } })).status);
  assert.ok(results.includes(401));
  assert.equal(results.at(-1), 429);
});

test('non-loopback connections cannot reach API even with a localhost Host', async () => {
  const middleware = createLocalAdminMiddleware(evidenceRoot);
  let status;
  let body;
  await new Promise(resolve => middleware({
    url: '/api/takhaial/session', method: 'GET',
    socket: { remoteAddress: '192.168.1.5' }, headers: { host: 'localhost:4173' },
  }, { writeHead: code => { status = code; }, end: value => { body = JSON.parse(value); resolve(); } }, () => assert.fail('Must not fall through')));
  assert.equal(status, 403);
  assert.match(body.error, /only on this computer/);
});
