// Node 18+ script to test Next.js email API routes for contact and bug report
// Usage: node tools/test_email_routes.mjs

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok || res.status === 404) return true; // server is responding
    } catch {}
    await new Promise(r => setTimeout(r, 1000));
  }
  throw new Error(`Server at ${url} did not become ready within ${timeoutMs}ms`);
}

async function testContact() {
  const payload = {
    name: 'Test User',
    email: 'tester@example.com',
    phone: '+1-555-0100',
    subject: 'API Contact Test',
    message: 'This is a test message sent by the automated test script.'
  };
  const res = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  return { status: res.status, ok: res.ok, json };
}

async function testBugReport() {
  const form = new FormData();
  form.append('title', 'Automated Bug Report Test');
  form.append('description', 'Steps: none. Expected: success. Actual: success. Automated test.');
  form.append('priority', 'medium');
  form.append('email', 'tester@example.com');

  // Add a small text attachment
  const blob = new Blob([Buffer.from('This is a test attachment from the email API test script.')], { type: 'text/plain' });
  const file = new File([blob], 'test-attachment.txt', { type: 'text/plain' });
  form.append('attachments', file);

  const res = await fetch(`${BASE_URL}/api/bug-report`, {
    method: 'POST',
    body: form
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  return { status: res.status, ok: res.ok, json };
}

(async () => {
  console.log(`[test] Using BASE_URL=${BASE_URL}`);
  try {
    await waitForServer(`${BASE_URL}/`);
  } catch (e) {
    console.error('[test] Server not ready:', e.message);
    process.exit(1);
  }

  console.log('[test] Server is ready. Testing /api/contact ...');
  const contact = await testContact();
  console.log('[test] Contact result:', contact);

  console.log('[test] Testing /api/bug-report ...');
  const bug = await testBugReport();
  console.log('[test] Bug report result:', bug);

  if (!contact.ok || !bug.ok) {
    console.error('[test] One or more API tests failed');
    process.exit(2);
  }
  console.log('[test] All email API tests passed.');
})();
