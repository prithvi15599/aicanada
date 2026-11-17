import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { normalizeEmail, validateRegistration } from './validation.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 3000);
const duplicateWindow = new Map();
const isProduction = process.env.NODE_ENV === 'production' || process.env.PREVIEW_STATIC === 'true';
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml' };
const vite = isProduction ? null : await createViteServer({ root, server: { middlewareMode: true, hmr: false }, appType: 'spa' });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  if (url.pathname === '/api/registration-status' && req.method === 'GET') {
    return sendJson(res, 200, { configured: Boolean(process.env.GOOGLE_APPS_SCRIPT_URL && process.env.GOOGLE_APPS_SCRIPT_SECRET) });
  }
  if (url.pathname === '/api/register') return handleRegistration(req, res);
  if (!isProduction && vite) return vite.middlewares(req, res, () => sendText(res, 404, 'Not found'));
  return serveProduction(url.pathname, res);
});

async function handleRegistration(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { code: 'method_not_allowed', message: 'Use POST for registration.' });
  let body;
  try { body = await readBody(req); } catch { return sendJson(res, 400, { code: 'invalid_json', message: 'Please send a valid registration form.' }); }
  const result = validateRegistration(body);
  if (!result.ok) return sendJson(res, 400, { code: 'validation_error', message: 'Please review the highlighted fields.', errors: result.errors });
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  const secret = process.env.GOOGLE_APPS_SCRIPT_SECRET;
  if (!url || !secret) return sendJson(res, 503, { code: 'setup_incomplete', message: 'Registration is not connected yet. Please check back once the organizer has finished setting up the registration system.' });
  const key = normalizeEmail(result.data.email);
  const previous = duplicateWindow.get(key);
  if (previous && Date.now() - previous < 10 * 60 * 1000) return sendJson(res, 409, { code: 'duplicate_submission', message: 'A registration with this team contact email was just submitted. Please wait before trying again.' });
  duplicateWindow.set(key, Date.now());
  try {
    const upstreamUrl = new URL(url);
    upstreamUrl.searchParams.set('secret', secret);
    const registration = { ...result.data, email: key };
    const upstream = await fetch(upstreamUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-AIC-Secret': secret }, body: JSON.stringify({ ...registration, name: registration.fullName, numberOfTeamMembers: registration.teamSize, additionalInformation: registration.additionalInfo, registration, secret }) });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok || data.success !== true) {
      duplicateWindow.delete(key);
      return sendJson(res, upstream.status >= 400 ? upstream.status : 502, { code: data.code || 'upstream_error', message: data.message || 'The registration system could not save your details. Please try again.' });
    }
    return sendJson(res, 200, { success: true, message: 'Your AIC registration has been successfully received.' });
  } catch {
    duplicateWindow.delete(key);
    return sendJson(res, 502, { code: 'upstream_unavailable', message: 'The registration system is temporarily unavailable. Your information was not submitted.' });
  }
}

async function serveProduction(pathname, res) {
  const safePath = pathname === '/' ? '/index.html' : pathname;
  const publicPath = join(root, 'dist', safePath);
  try {
    const content = await readFile(publicPath);
    res.writeHead(200, { 'Content-Type': mimeTypes[extname(publicPath)] || 'application/octet-stream' });
    res.end(content);
  } catch {
    const content = await readFile(join(root, 'dist', 'index.html'));
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(content);
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; if (raw.length > 20000) reject(new Error('too large')); });
    req.on('end', () => { try { resolve(JSON.parse(raw || '{}')); } catch { reject(new Error('invalid json')); } });
    req.on('error', reject);
  });
}
function sendJson(res, status, body) { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); }
function sendText(res, status, body) { res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end(body); }

server.listen(port, '0.0.0.0', () => console.log(`AIC server listening on http://0.0.0.0:${port}`));
