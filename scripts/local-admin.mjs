import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { lstat, mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const deriveKey = promisify(scrypt);
const SCRYPT = { N: 65536, r: 8, p: 1, maxmem: 128 * 1024 * 1024 };
const SESSION_MS = 30 * 60 * 1000;
const COOKIE = 'takhaial_local_session';
const PREFIX = '/api/takhaial';
const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);
const FIELD_LIMITS = { heroTitle: 140, heroDescription: 600, contactEmail: 254 };

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function reply(res, status, value) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Cross-Origin-Resource-Policy': 'same-origin',
  });
  res.end(JSON.stringify(value));
}

function validHost(value) {
  if (typeof value !== 'string') return false;
  const match = /^(localhost|127\.0\.0\.1|\[::1\])(?::([1-9]\d{0,4}))?$/i.exec(value);
  return Boolean(match && (!match[2] || Number(match[2]) <= 65535));
}

function checkRequest(req) {
  if (!LOOPBACK.has(req.socket.remoteAddress) || !validHost(req.headers.host)
    || req.headers.forwarded || req.headers['x-forwarded-for']) {
    throw new HttpError(403, 'The studio is available only on this computer.');
  }
  if (['GET', 'HEAD'].includes(req.method)) return;
  let origin;
  try { origin = new URL(req.headers.origin); } catch { /* Missing/null origins are denied. */ }
  if (!origin || origin.protocol !== 'http:' || origin.origin !== req.headers.origin
    || !validHost(origin.host) || origin.host.toLowerCase() !== req.headers.host.toLowerCase()
    || req.headers['sec-fetch-site'] === 'cross-site') {
    throw new HttpError(403, 'A same-origin local request is required.');
  }
}

function readJson(req) {
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) {
    throw new HttpError(415, 'Send JSON content.');
  }
  return new Promise((resolve, reject) => {
    let size = 0;
    let rejected = false;
    const chunks = [];
    req.on('data', chunk => {
      size += chunk.length;
      if (size > 4096) {
        if (!rejected) reject(new HttpError(413, 'The request is too large.'));
        rejected = true; chunks.length = 0;
      } else if (!rejected) chunks.push(chunk);
    });
    req.on('end', () => {
      if (rejected) return;
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch { reject(new HttpError(400, 'Invalid JSON.')); }
    });
    req.on('error', () => reject(new HttpError(400, 'The request could not be read.')));
  });
}

function objectOnly(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function passwordFrom(body) {
  if (!objectOnly(body) || Object.keys(body).some(key => key !== 'password')
    || typeof body.password !== 'string' || [...body.password].length < 12
    || [...body.password].length > 128) {
    throw new HttpError(400, 'Use a password between 12 and 128 characters.');
  }
  return body.password;
}

function settingsFrom(body) {
  if (!objectOnly(body) || Object.keys(body).length !== 1 || !objectOnly(body.settings)) {
    throw new HttpError(400, 'Provide a settings object.');
  }
  const settings = {};
  for (const [key, value] of Object.entries(body.settings)) {
    if (!Object.hasOwn(FIELD_LIMITS, key) || typeof value !== 'string') {
      throw new HttpError(400, 'Only the three supported text settings may be changed.');
    }
    const clean = value.trim();
    if (!clean || [...clean].length > FIELD_LIMITS[key] || /[<>\u0000-\u001f\u007f]/.test(clean)) {
      throw new HttpError(400, `${key} must be plain text, between 1 and ${FIELD_LIMITS[key]} characters.`);
    }
    if (key === 'contactEmail' && !/^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?)+$/i.test(clean)) {
      throw new HttpError(400, 'Enter a valid contact email address.');
    }
    settings[key] = clean;
  }
  return { settings };
}

async function optionalJson(filename) {
  try { return JSON.parse(await readFile(filename, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

function cookieToken(req) {
  const match = (req.headers.cookie || '').split(';').map(part => part.trim())
    .find(part => part.startsWith(`${COOKIE}=`));
  const token = match?.slice(COOKIE.length + 1);
  return token && /^[A-Za-z0-9_-]{43}$/.test(token) ? token : null;
}

function tokenKey(token) { return createHash('sha256').update(token).digest('hex'); }
function sessionCookie(token = '') {
  return `${COOKIE}=${token}; Path=${PREFIX}; HttpOnly; SameSite=Strict; Max-Age=${token ? SESSION_MS / 1000 : 0}`;
}

// This is a loopback-only development service, not a production authentication system.
export function createLocalAdminMiddleware(rootDir, { now = Date.now } = {}) {
  const privateDir = path.join(path.resolve(rootDir), '.local');
  const credentialsFile = path.join(privateDir, 'admin.json');
  const contentFile = path.join(privateDir, 'content.json');
  const sessions = new Map();
  const attempts = new Map();
  let writes = Promise.resolve();

  function exclusive(operation) {
    const current = writes.then(operation);
    writes = current.catch(() => {});
    return current;
  }

  async function ensurePrivateDirectory() {
    await mkdir(privateDir, { recursive: true, mode: 0o700 });
    if ((await lstat(privateDir)).isSymbolicLink()) throw new Error('Private storage may not be a link.');
  }

  async function readPrivate(filename) {
    try {
      if ((await lstat(privateDir)).isSymbolicLink() || (await lstat(filename)).isSymbolicLink()) {
        throw new Error('Private storage may not be a link.');
      }
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
    return optionalJson(filename);
  }

  async function credentials() {
    const stored = await readPrivate(credentialsFile);
    if (stored && (stored.version !== 1 || stored.algorithm !== 'scrypt'
      || !/^[a-f0-9]{64}$/.test(stored.salt) || !/^[a-f0-9]{128}$/.test(stored.hash))) {
      throw new Error('Invalid studio credential storage.');
    }
    return stored;
  }

  function authenticated(req) {
    for (const [key, expires] of sessions) if (expires <= now()) sessions.delete(key);
    const token = cookieToken(req);
    return token ? sessions.has(tokenKey(token)) : false;
  }

  function removeSession(req) {
    const old = cookieToken(req);
    if (old) sessions.delete(tokenKey(old));
  }

  function grantSession(req, res) {
    removeSession(req);
    while (sessions.size >= 16) sessions.delete(sessions.keys().next().value);
    const token = randomBytes(32).toString('base64url');
    sessions.set(tokenKey(token), now() + SESSION_MS);
    res.setHeader('Set-Cookie', sessionCookie(token));
  }

  function limitLogin(req) {
    const key = req.socket.remoteAddress;
    const prior = attempts.get(key);
    const state = !prior || prior.until <= now() ? { count: 0, until: now() + 60_000 } : prior;
    state.count += 1; attempts.set(key, state);
    if (state.count > 8) throw new HttpError(429, 'Too many attempts. Wait one minute before trying again.');
  }

  async function handle(req, res, route) {
    checkRequest(req);
    if (route === `${PREFIX}/content` && req.method === 'GET') {
      const stored = await readPrivate(contentFile);
      return reply(res, 200, stored ? settingsFrom(stored) : { settings: {} });
    }
    if (route === `${PREFIX}/session` && req.method === 'GET') {
      return reply(res, 200, { authenticated: authenticated(req), setupRequired: !(await credentials()) });
    }
    if (route === `${PREFIX}/setup` && req.method === 'POST') {
      const password = passwordFrom(await readJson(req));
      await exclusive(async () => {
        if (await credentials()) throw new HttpError(409, 'The local studio is already configured. Sign in instead.');
        limitLogin(req);
        const salt = randomBytes(32).toString('hex');
        const hash = (await deriveKey(password, salt, 64, SCRYPT)).toString('hex');
        await ensurePrivateDirectory();
        await writeFile(credentialsFile, JSON.stringify({ version: 1, algorithm: 'scrypt', salt, hash }), { flag: 'wx', mode: 0o600 });
      });
      grantSession(req, res);
      return reply(res, 201, { authenticated: true, setupRequired: false });
    }
    if (route === `${PREFIX}/login` && req.method === 'POST') {
      limitLogin(req);
      const password = passwordFrom(await readJson(req));
      const stored = await credentials();
      if (!stored) throw new HttpError(409, 'Set up the local studio first.');
      const actual = await deriveKey(password, stored.salt, 64, SCRYPT);
      if (!timingSafeEqual(actual, Buffer.from(stored.hash, 'hex'))) throw new HttpError(401, 'The password is not correct.');
      attempts.delete(req.socket.remoteAddress);
      grantSession(req, res);
      return reply(res, 200, { authenticated: true, setupRequired: false });
    }
    if (route === `${PREFIX}/logout` && req.method === 'POST') {
      removeSession(req); res.setHeader('Set-Cookie', sessionCookie());
      return reply(res, 200, { authenticated: false });
    }
    if (route === `${PREFIX}/content` && req.method === 'PUT') {
      if (!authenticated(req)) throw new HttpError(401, 'Sign in to edit the site.');
      const content = settingsFrom(await readJson(req));
      await exclusive(async () => {
        await ensurePrivateDirectory();
        const temporary = path.join(privateDir, `content-${randomBytes(12).toString('hex')}.tmp`);
        try {
          await writeFile(temporary, JSON.stringify(content, null, 2), { flag: 'wx', mode: 0o600 });
          await rename(temporary, contentFile);
        } finally { await unlink(temporary).catch(error => { if (error.code !== 'ENOENT') throw error; }); }
      });
      return reply(res, 200, content);
    }
    throw new HttpError(404, 'Unknown local studio endpoint.');
  }

  return (req, res, next) => {
    let route;
    try { route = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { return reply(res, 400, { error: 'Invalid URL.' }); }
    // Vite can serve root files and /@fs/ URLs. Keep all private storage out of both.
    if (/(?:^|[\\/])\.local(?:[\\/]|$)/i.test(route)) return reply(res, 404, { error: 'Not found.' });
    if (route !== PREFIX && !route.startsWith(`${PREFIX}/`)) return next();
    handle(req, res, route).catch(error => {
      if (!res.headersSent) reply(res, error.status || 500, { error: error.status ? error.message : 'Local studio storage is unavailable. No changes were applied.' });
    });
  };
}

export function createLocalAdminPlugin(rootDir) {
  const middleware = createLocalAdminMiddleware(rootDir);
  function install(server, mode) {
    if (!['127.0.0.1', 'localhost', '::1'].includes(server.config[mode]?.host)) {
      throw new Error('Takhaial local studio requires a loopback-only server host.');
    }
    server.middlewares.use(middleware);
  }
  return {
    name: 'takhaial-local-studio',
    config: () => ({
      server: { host: '127.0.0.1', fs: { deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/.local/**'] } },
      preview: { host: '127.0.0.1' },
    }),
    configureServer: server => install(server, 'server'),
    configurePreviewServer: server => install(server, 'preview'),
  };
}
