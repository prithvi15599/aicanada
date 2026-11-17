export async function handler() {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify({ configured: Boolean(process.env.GOOGLE_APPS_SCRIPT_URL && process.env.GOOGLE_APPS_SCRIPT_SECRET) })
  };
}
