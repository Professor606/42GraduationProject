/* ============================================================
   Lab 2 — Open Redirect — Interactive Demo
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const toggle    = document.getElementById('or-toggle');
  const vulnLabel = document.querySelector('.toggle__label--vuln');
  const fixLabel  = document.querySelector('.toggle__label--fix');
  const resultBox = document.getElementById('or-result');
  const resetBtn  = document.getElementById('or-reset');

  // Browser sim elements
  const urlText   = document.getElementById('or-url-text');
  const lockIcon  = document.getElementById('or-lock');
  const simBody   = document.getElementById('or-sim-body');

  let isFixed = false;

  // Whitelist for the fixed version
  const ALLOWED_DOMAINS = ['trusted-bank.com', 'myapp.com', 'cdn.myapp.com'];

  /* ---- Toggle handler ---- */
  toggle.addEventListener('change', () => {
    isFixed = toggle.checked;
    vulnLabel.style.color = isFixed ? 'var(--text-dim)' : 'var(--red)';
    fixLabel.style.color  = isFixed ? 'var(--green)' : 'var(--text-dim)';
    resetDemo();
  });

  /* ---- Payload buttons ---- */
  document.querySelectorAll('.or-payload').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.url;
      runPayload(url, btn.dataset.label);
    });
  });

  /* ---- Reset ---- */
  if (resetBtn) {
    resetBtn.addEventListener('click', resetDemo);
  }

  /* ---- Run payload ---- */
  function runPayload(maliciousUrl, label) {
    resetDemo();

    // Show initial login page
    showLoginPage(maliciousUrl);

    // Handle "login" click
    const loginBtn = simBody.querySelector('.login-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', async () => {
        if (isFixed) {
          handleFixedRedirect(maliciousUrl, label);
        } else {
          await handleVulnerableRedirect(maliciousUrl, label);
        }
      });
    }

    resultBox.className = 'result-box';
    resultBox.innerHTML = '<span style="color:var(--orange)">⏳ Click "Log In" in the simulated browser to trigger the redirect…</span>';
  }

  /* ---- Show login page ---- */
  function showLoginPage(redirectUrl) {
    const baseUrl = 'https://trusted-bank.com/login';
    const fullUrl = `${baseUrl}?redirect=${encodeURIComponent(redirectUrl)}`;

    urlText.innerHTML =
      `<span class="url-safe">🔒 trusted-bank.com</span>/login?<span class="url-param">redirect=</span><span class="url-danger">${escapeHTML(redirectUrl)}</span>`;
    lockIcon.textContent = '🔒';

    simBody.innerHTML = `
      <div class="login-page">
        <h4>🏦 Trusted Bank</h4>
        <div class="form-group">
          <label>Email</label>
          <input type="text" value="user@example.com" readonly>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" value="••••••••" readonly>
        </div>
        <button class="login-btn">Log In</button>
        <p style="font-size:0.75rem; color:var(--text-dim); margin-top:10px;">
          After login you'll be redirected to: <br>
          <code style="color:var(--orange); word-break:break-all; font-size:0.72rem;">${escapeHTML(redirectUrl)}</code>
        </p>
      </div>
    `;
  }

  /* ---- Vulnerable redirect ---- */
  async function handleVulnerableRedirect(maliciousUrl, label) {
    // Show redirect animation
    simBody.innerHTML = `
      <div class="redirect-arrow active">
        <span class="arrow-icon">⬇️</span>
        <p style="color:var(--text-muted); font-size:0.88rem;">Redirecting…</p>
      </div>
    `;

    urlText.innerHTML = `<span style="color:var(--text-dim)">Redirecting…</span>`;

    await sleep(1200);

    // Show phishing page
    lockIcon.textContent = '⚠️';
    urlText.innerHTML = `<span class="url-danger">⚠️ ${escapeHTML(maliciousUrl)}</span>`;

    simBody.innerHTML = `
      <div class="phishing-page active">
        <span class="warning-icon">🎣</span>
        <h4>Phishing Page Loaded!</h4>
        <p style="font-size:0.88rem; color:var(--text-muted); max-width:320px; margin:0 auto;">
          The user has been redirected from <strong style="color:var(--green)">trusted-bank.com</strong>
          to <strong style="color:var(--red)">${escapeHTML(maliciousUrl)}</strong>.
          <br><br>
          An attacker could host a fake login page here to steal credentials.
        </p>
      </div>
    `;

    resultBox.className = 'result-box result-box--danger';
    resultBox.innerHTML =
      `<strong style="color:var(--red)">✗ Exploited:</strong> The app blindly redirected to ` +
      `<code style="color:var(--red)">${escapeHTML(maliciousUrl)}</code>. ` +
      `The user trusted the original link because it started with <code style="color:var(--green)">trusted-bank.com</code>. ` +
      `An attacker can use this to phish credentials or deliver malware.`;

    showToast('Open redirect attack succeeded!', 'danger');
  }

  /* ---- Fixed redirect ---- */
  function handleFixedRedirect(maliciousUrl, label) {
    // Parse URL and check whitelist
    let hostname = '';
    try {
      // Handle protocol-relative URLs
      let urlToCheck = maliciousUrl;
      if (urlToCheck.startsWith('//')) {
        urlToCheck = 'https:' + urlToCheck;
      }
      if (urlToCheck.startsWith('javascript:')) {
        hostname = '[javascript: URI]';
      } else {
        const parsed = new URL(urlToCheck);
        hostname = parsed.hostname;
      }
    } catch {
      hostname = '[invalid URL]';
    }

    const isAllowed = ALLOWED_DOMAINS.some(d =>
      hostname === d || hostname.endsWith('.' + d)
    );

    lockIcon.textContent = '🛡️';
    urlText.innerHTML = `<span class="url-safe">🛡️ trusted-bank.com</span>/login — <span style="color:var(--green)">redirect blocked</span>`;

    simBody.innerHTML = `
      <div class="redirect-blocked active">
        <span class="shield-icon">🛡️</span>
        <h4>Redirect Blocked!</h4>
        <p style="font-size:0.88rem; color:var(--text-muted); max-width:360px; margin:0 auto;">
          The server validated the <code style="color:var(--orange)">redirect</code> parameter and found that
          <strong style="color:var(--red)">${escapeHTML(hostname)}</strong> is not in the allowed domain whitelist.
        </p>
        <div style="margin-top:12px; text-align:left; width:100%; max-width:320px;">
          <p style="font-size:0.78rem; color:var(--text-dim); margin-bottom:6px;">Allowed domains:</p>
          <ul style="list-style:none; display:flex; flex-direction:column; gap:4px;">
            ${ALLOWED_DOMAINS.map(d =>
              `<li style="font-family:'JetBrains Mono',monospace; font-size:0.8rem; color:var(--green); padding:3px 8px; background:rgba(0,255,136,0.08); border-radius:4px;">✓ ${d}</li>`
            ).join('')}
          </ul>
          <p style="font-size:0.78rem; color:var(--red); margin-top:8px; font-family:'JetBrains Mono',monospace;">
            ✗ ${escapeHTML(hostname)} — not allowed
          </p>
        </div>
      </div>
    `;

    resultBox.className = 'result-box result-box--success';
    resultBox.innerHTML =
      `<strong style="color:var(--green)">✓ Blocked:</strong> The server checked the redirect URL against a whitelist of allowed domains. ` +
      `<code style="color:var(--red)">${escapeHTML(hostname)}</code> is not on the list, so the redirect was denied. ` +
      `The user stays safely on <code style="color:var(--green)">trusted-bank.com</code>.`;

    showToast('Open redirect attempt blocked!', 'success');
  }

  /* ---- Reset ---- */
  function resetDemo() {
    lockIcon.textContent = '';
    urlText.innerHTML = '<span style="color:var(--text-dim)">Enter a URL or click a payload below</span>';
    simBody.innerHTML = `
      <p style="color:var(--text-dim); font-size:0.9rem; text-align:center;">
        🌐 Click a payload button below to simulate the attack
      </p>
    `;
    resultBox.className = 'result-box';
    resultBox.innerHTML = '<span style="color:var(--text-dim)">Click a payload button above to run the demo.</span>';
  }
});
