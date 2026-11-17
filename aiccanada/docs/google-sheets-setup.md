# AIC registration setup

The website deliberately stays honest until the organizer connects the registration system. A successful confirmation is shown only after the backend receives a success response from Google Apps Script and Apps Script confirms that it appended a row to the private Google Sheet.

## 1. Create a private test Sheet

Create a new Google Sheet in the organizer’s Google account. Keep sharing restricted to the organizer and explicitly authorized collaborators. Use a separate test spreadsheet before connecting the live registration form.

## 2. Add the Apps Script

Open **Extensions → Apps Script**, replace the starter file with the code below, and update `SHEET_NAME` if needed. The script creates the header row, enables a filter, freezes the header, sizes columns, and uses the `America/Toronto` timezone.

```javascript
const SHEET_NAME = 'Registrations';
const HEADERS = ['Submission Date and Time', 'Full Name', 'Email', 'School', 'Grade', 'Team Name', 'Team Size', 'Additional Information'];

function doPost(e) {
  let body;
  try { body = JSON.parse((e.postData && e.postData.contents) || '{}'); } catch (error) { return response({ success: false, code: 'invalid_json', message: 'Invalid request.' }); }
  const secret = PropertiesService.getScriptProperties().getProperty('AIC_SHARED_SECRET');
  if (!secret || body.secret !== secret) return response({ success: false, code: 'unauthorized', message: 'Unauthorized request.' }, 401);
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sheet = getSheet();
    const email = String(body.email || '').trim().toLowerCase();
    if (!email || !body.fullName || !body.school || !body.grade || !body.teamName || !['2', '3', '4'].includes(String(body.teamSize))) return response({ success: false, code: 'validation_error', message: 'Required fields are missing.' }, 400);
    const values = sheet.getDataRange().getValues();
    const duplicate = values.slice(1).some(row => String(row[2] || '').trim().toLowerCase() === email);
    if (duplicate) return response({ success: false, code: 'duplicate_submission', message: 'A registration with this email already exists.' }, 409);
    sheet.appendRow([new Date(), body.fullName, email, body.school, body.grade, body.teamName, String(body.teamSize), body.additionalInfo || '']);
    return response({ success: true, message: 'Saved.' }, 200);
  } finally {
    lock.releaseLock();
  }
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  spreadsheet.setSpreadsheetTimeZone('America/Toronto');
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
  if (!sheet.getFilter()) sheet.getRange(1, 1, Math.max(sheet.getLastRow(), 1), HEADERS.length).createFilter();
  sheet.autoResizeColumns(1, HEADERS.length);
  return sheet;
}

function response(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Store the shared secret

In Apps Script, open **Project Settings → Script Properties → Add script property**. Add:

- **Property:** `AIC_SHARED_SECRET`
- **Value:** a long random value known only to the organizer and the private Netlify environment configuration.

Do not put this value in the frontend, a public repository, or a Sheet cell.

## 4. Deploy the Web App

Select **Deploy → New deployment → Web app**. Set **Execute as** to the organizer’s account. Choose the access setting that permits the Netlify backend to call the endpoint without exposing the Sheet itself. Copy the Web App URL.

## 5. Configure Netlify

Add these environment variables in the Netlify site’s server-side environment settings. Never place them in `VITE_` variables or public configuration:

- `GOOGLE_APPS_SCRIPT_URL` = the deployed Apps Script Web App URL
- `GOOGLE_APPS_SCRIPT_SECRET` = the exact same value as `AIC_SHARED_SECRET`

Redeploy the website after saving the variables.

## 6. Test safely

Use the separate test Sheet first. Submit one test registration, confirm that one row is appended, then repeat the same email to confirm the duplicate response. Test an invalid email, missing grade, invalid team size, and a honeypot request. Only after the setup behaves correctly should the organizer repeat the deployment with the live private Sheet. Do not create sample registrations in the real registration spreadsheet.
