import { useEffect, useState } from 'react';
import './admin.css';
import Brand from './Brand';

const EMPTY_SETTINGS = { heroTitle: '', heroDescription: '', contactEmail: '' };
const API = '/api/takhaial';

async function callApi(path, { method = 'GET', data, signal } = {}) {
  const response = await fetch(`${API}/${path}`, {
    method, signal, credentials: 'same-origin',
    headers: data === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: data === undefined ? undefined : JSON.stringify(data),
  });
  const type = response.headers.get('content-type') || '';
  if (!type.includes('application/json')) throw new Error('The local studio service is unavailable. Run this project with its local Vite server.');
  const body = await response.json();
  if (!response.ok) {
    const error = new Error(body.error || 'The request could not be completed.');
    error.status = response.status;
    throw error;
  }
  return body;
}

export default function Admin({ defaultSettings = EMPTY_SETTINGS }) {
  const [session, setSession] = useState(null);
  const [settings, setSettings] = useState(EMPTY_SETTINGS);
  const [saved, setSaved] = useState(EMPTY_SETTINGS);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const dirty = Object.keys(EMPTY_SETTINGS).some(key => settings[key] !== saved[key]);

  useEffect(() => {
    const controller = new AbortController();
    document.title = 'Local Studio — Takhaial Tech';
    Promise.all([callApi('session', { signal: controller.signal }), callApi('content', { signal: controller.signal })])
      .then(([current, content]) => {
        setSession(current);
        const values = { ...EMPTY_SETTINGS, ...content.settings };
        setSettings(values); setSaved(values);
      })
      .catch(reason => { if (reason.name !== 'AbortError') setError(reason.message); });
    return () => controller.abort();
  }, []);

  async function authenticate(event) {
    event.preventDefault(); setError(''); setMessage('');
    if (session.setupRequired && password !== confirmation) { setError('The two passwords do not match.'); return; }
    setBusy(true);
    try {
      const result = await callApi(session.setupRequired ? 'setup' : 'login', { method: 'POST', data: { password } });
      setSession(result);
      setMessage(session.setupRequired ? 'Your local studio is ready.' : 'Signed in to the local studio.');
    } catch (reason) {
      setError(reason.message);
      if (reason.status === 409) setSession(await callApi('session').catch(() => session));
    } finally { setPassword(''); setConfirmation(''); setBusy(false); }
  }

  async function save(event) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    const overrides = Object.fromEntries(Object.entries(settings).map(([key, value]) => [key, value.trim()]).filter(([, value]) => value));
    try {
      await callApi('content', { method: 'PUT', data: { settings: overrides } });
      // Read back from disk through the API before claiming that the save persisted.
      const content = await callApi('content');
      const values = { ...EMPTY_SETTINGS, ...content.settings };
      setSettings(values); setSaved(values);
      setMessage('Saved and verified from local storage. Reload the website to see your changes.');
    } catch (reason) {
      setError(reason.message);
      if (reason.status === 401) setSession({ authenticated: false, setupRequired: false });
    } finally { setBusy(false); }
  }

  async function reload() {
    setBusy(true); setError(''); setMessage('');
    try {
      const [current, content] = await Promise.all([callApi('session'), callApi('content')]);
      setSession(current);
      const values = { ...EMPTY_SETTINGS, ...content.settings };
      setSettings(values); setSaved(values); setMessage('Loaded the saved local settings.');
    } catch (reason) { setError(reason.message); }
    finally { setBusy(false); }
  }

  async function logout() {
    setBusy(true); setError(''); setMessage('');
    try {
      await callApi('logout', { method: 'POST' });
      setSession({ authenticated: false, setupRequired: false });
      setSettings(saved); setMessage('Signed out. Your session has been revoked.');
    } catch (reason) { setError(reason.message); }
    finally { setBusy(false); }
  }

  function change(event) { const { name, value } = event.target; setSettings(current => ({ ...current, [name]: value })); }

  return <main className="tk-admin">
    <div className="tk-admin-shell">
      <header className="tk-admin-header">
        <a className="tk-admin-brand" href="/" aria-label="Takhaial Tech home"><Brand/></a>
        <span className="tk-admin-badge">LOCAL STUDIO</span>
      </header>
      <section className="tk-admin-intro" aria-labelledby="studio-title">
        <p className="tk-admin-eyebrow">Private workspace / This computer only</p>
        <h1 id="studio-title">A little control.<br />A clearer message.</h1>
        <p>Edit the website’s key messages without changing its source. This unlisted studio is separate from the public experience.</p>
      </section>
      <div className="tk-admin-status" aria-live="polite">
        {error ? <p className="tk-admin-error" role="alert">{error}</p> : null}
        {message ? <p className="tk-admin-success">{message}</p> : null}
      </div>
      {!session ? <div className="tk-admin-card"><p>{error ? 'The studio could not connect.' : 'Connecting to the local studio…'}</p>{error ? <button type="button" onClick={reload} disabled={busy}>Try again</button> : null}</div>
        : !session.authenticated ? <section className="tk-admin-card" aria-labelledby="access-title">
          <h2 id="access-title">{session.setupRequired ? 'Set up local access' : 'Welcome back'}</h2>
          <p>{session.setupRequired ? 'Choose your own password. There is no default or shared password, and this password is stored only as a salted hash on this computer.' : 'Enter your local studio password. Sessions expire after 30 minutes and are cleared when the local server restarts.'}</p>
          <form onSubmit={authenticate}>
            <label htmlFor="studio-password">{session.setupRequired ? 'Create password' : 'Password'}</label>
            <input id="studio-password" type="password" value={password} onChange={event => setPassword(event.target.value)} minLength={12} maxLength={128} required autoComplete={session.setupRequired ? 'new-password' : 'current-password'} aria-describedby="password-hint" disabled={busy} />
            <small id="password-hint">12–128 characters. A long, unique passphrase works well.</small>
            {session.setupRequired ? <><label htmlFor="studio-confirmation">Confirm password</label><input id="studio-confirmation" type="password" value={confirmation} onChange={event => setConfirmation(event.target.value)} minLength={12} maxLength={128} required autoComplete="new-password" disabled={busy} /></> : null}
            <button className="tk-admin-primary" type="submit" disabled={busy}>{busy ? 'Please wait…' : session.setupRequired ? 'Create local studio' : 'Sign in'}</button>
          </form>
        </section>
        : <section className="tk-admin-card" aria-labelledby="editor-title">
          <div className="tk-admin-editor-heading"><div><h2 id="editor-title">Website settings</h2><p>Leave a field empty to use its default website copy.</p></div><span className="tk-admin-edited">{dirty ? 'Unsaved changes' : 'Up to date'}</span></div>
          <form onSubmit={save}>
            <label htmlFor="studio-hero-title">Homepage headline</label>
            <input id="studio-hero-title" name="heroTitle" value={settings.heroTitle} onChange={change} maxLength={140} placeholder={defaultSettings.heroTitle || 'Use the default homepage headline'} disabled={busy} />
            <small>{settings.heroTitle.length}/140 characters</small>
            <label htmlFor="studio-hero-description">Homepage description</label>
            <textarea id="studio-hero-description" name="heroDescription" value={settings.heroDescription} onChange={change} maxLength={600} rows={4} placeholder={defaultSettings.heroDescription || 'Use the default homepage description'} disabled={busy} />
            <small>{settings.heroDescription.length}/600 characters. Plain text only.</small>
            <label htmlFor="studio-contact-email">Public contact email</label>
            <input id="studio-contact-email" name="contactEmail" type="email" value={settings.contactEmail} onChange={change} maxLength={254} placeholder={defaultSettings.contactEmail || 'info@takhaialtech.com'} autoComplete="off" disabled={busy} />
            <div className="tk-admin-actions"><button className="tk-admin-primary" type="submit" disabled={busy || !dirty}>{busy ? 'Please wait…' : 'Save changes'}</button><button type="button" onClick={reload} disabled={busy}>{dirty ? 'Discard & reload saved' : 'Reload saved settings'}</button></div>
          </form>
          <div className="tk-admin-editor-footer"><a href="/" target="_blank" rel="noopener noreferrer">Open website <span aria-hidden="true">↗</span></a><button type="button" onClick={logout} disabled={busy}>Sign out{dirty ? ' & discard changes' : ''}</button></div>
        </section>}
      <aside className="tk-admin-notice"><strong>Built for a local preview, not a public deployment.</strong><p>This service only accepts requests from this computer. Passwords are hashed, sessions use HttpOnly cookies, and changes stay in private local files outside the public build. Publishing a secure admin service requires a separate production backend, HTTPS and an access policy. A hidden address alone is not security.</p></aside>
    </div>
  </main>;
}
