import { normalizeEmail, validateRegistration } from '../../server/validation.mjs';

const duplicateWindow = new Map();

export async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { code: 'method_not_allowed', message: 'Use POST for registration.' });
  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return json(400, { code: 'invalid_json', message: 'Please send a valid registration form.' }); }
  const result = validateRegistration(body);
  if (!result.ok) return json(400, { code: 'validation_error', message: 'Please review the highlighted fields.', errors: result.errors });
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  const secret = process.env.GOOGLE_APPS_SCRIPT_SECRET;
  if (!url || !secret) return json(503, { code: 'setup_incomplete', message: 'Registration is not connected yet. Please check back once the organizer has finished setting up the registration system.' });
  const normalizedEmail = normalizeEmail(result.data.email);
  const previous = duplicateWindow.get(normalizedEmail);
  if (previous && Date.now() - previous < 10 * 60 * 1000) return json(409, { code: 'duplicate_submission', message: 'A registration with this team contact email was just submitted. Please wait before trying again.' });
  duplicateWindow.set(normalizedEmail, Date.now());
  try {
    const upstreamUrl = new URL(url);
    upstreamUrl.searchParams.set('secret', secret);
    const registration = { ...result.data, email: normalizedEmail };
    const response = await fetch(upstreamUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-AIC-Secret': secret },
      body: JSON.stringify({ ...registration, name: registration.fullName, numberOfTeamMembers: registration.teamSize, additionalInformation: registration.additionalInfo, registration, secret })
    });
    const responseBody = await response.json().catch(() => ({}));
    if (!response.ok || responseBody.success !== true) { duplicateWindow.delete(normalizedEmail); return json(response.status >= 400 ? response.status : 502, { code: responseBody.code || 'upstream_error', message: responseBody.message || 'The registration system could not save your details. Please try again.' }); }
    return json(200, { success: true, message: 'Your AIC registration has been successfully received.' });
  } catch {
    duplicateWindow.delete(normalizedEmail);
    return json(502, { code: 'upstream_unavailable', message: 'The registration system is temporarily unavailable. Your information was not submitted.' });
  }
}

function json(statusCode, body) {
  return { statusCode, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(body) };
}
