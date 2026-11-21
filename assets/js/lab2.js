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

  /* ---- Initialize Simulated Log Viewer ---- */
  const orLogger = new LabLogViewer({
    containerId: 'or-log-container',
    labKey: 'open-redirect',
    title: 'Gateway & Authentication Audit Logs (CWE-601)'
  });

  // Baseline startup logs
  orLogger.addLog({
    source: 'gateway:proxy',
    level: 'info',
    message: 'Edge API gateway initialized on port 443. Route <code>/login</code> bound to authentication handler.'
  });
  orLogger.addLog({
    source: 'auth:service',
    level: 'info',
    message: 'Token verification subsystem online. Session cookie domain scope: <code>.trusted-bank.com</code>.'
  });
  orLogger.addLog({
    source: 'router:sec',
    level: 'warn',
    message: 'Parameter routing check: Redirect destination validation is NOT configured (open redirection active).'
  });

  /* ---- Toggle handler ---- */
  toggle.addEventListener('change', () => {
    isFixed = toggle.checked;
    vulnLabel.style.color = isFixed ? 'var(--text-dim)' : 'var(--red)';
    fixLabel.style.color  = isFixed ? 'var(--green)' : 'var(--text-dim)';
    resetDemo();

    if (isFixed) {
      orLogger.addLog({
        source: 'gateway:filter',
        level: 'audit',
        message: 'Security policy reloaded: Domain allowlist validator ACTIVE. Allowed hostnames: [<code>trusted-bank.com</code>, <code>myapp.com</code>, <code>cdn.myapp.com</code>].'
      });
      orLogger.addLog({
        source: 'sec:enforce',
        level: 'blocked',
        message: 'Defense active: Untrusted destination URLs will be rejected and redirected to safe default <code>/</code>.'
      });
    } else {
      orLogger.addLog({
        source: 'gateway:filter',
        level: 'warn',
        message: 'Security policy downgraded: Destination hostname allowlist DISABLED. Parameter <code>redirect</code> is unvalidated.'
      });
      orLogger.addLog({
        source: 'sec:policy',
        level: 'warn',
        message: 'Security posture downgraded: Vulnerability CWE-601 is active.'
      });
    }
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
    resetBtn.addEventListener('click', () => {
      resetDemo();
      orLogger.addLog({
        source: 'sandbox:ctl',
        level: 'info',
        message: 'Browser simulator reset to initial baseline.'
      });
    });
  }

  /* ---- Run payload ---- */
  function runPayload(maliciousUrl, label) {
    resetDemo();

    // Show initial login page
    showLoginPage(maliciousUrl);

    orLogger.addLog({
      source: 'gateway:proxy',
      level: 'info',
      message: `Incoming request: <code>GET /login?redirect=${escapeHTML(maliciousUrl)}</code> [Payload type: ${escapeHTML(label)}]`
    });

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
    resultBox.innerHTML = `${ICONS.clock} <span style="color:var(--orange)">Click "Log In" in the simulated browser above to trigger the redirect...</span>`;
  }

  /* ---- Show login page ---- */
  function showLoginPage(redirectUrl) {
    urlText.innerHTML =
      `<span class="url-safe">${ICONS.lock} trusted-bank.com</span>/login?<span class="url-param">redirect=</span><span class="url-danger">${escapeHTML(redirectUrl)}</span>`;
    lockIcon.innerHTML = ICONS.lock;

    simBody.innerHTML = `
      <div class="login-page">
        <h4 style="display:flex; align-items:center; justify-content:center; gap:8px;">${ICONS.bank} Trusted Bank</h4>
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
          After login you will be redirected to: <br>
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
        <span class="arrow-icon">${ICONS.arrowDown}</span>
        <p style="color:var(--text-muted); font-size:0.88rem;">Redirecting to target...</p>
      </div>
    `;

    urlText.innerHTML = `<span style="color:var(--text-dim)">Redirecting...</span>`;

    orLogger.addLog({
      source: 'auth:service',
      level: 'info',
      message: 'POST /login credentials verified. Authenticated user "user@example.com". Issued session auth token.'
    });

    orLogger.addLog({
      source: 'router:redirect',
      level: 'warn',
      message: `Reading parameter <code>redirect=${escapeHTML(maliciousUrl)}</code>. No hostname validation configured.`
    });

    await sleep(1100);

    // Show phishing page
    lockIcon.innerHTML = ICONS.alertTriangle;
    urlText.innerHTML = `<span class="url-danger">${ICONS.alertTriangle} ${escapeHTML(maliciousUrl)}</span>`;

    simBody.innerHTML = `
      <div class="phishing-page active">
        <span class="warning-icon">${ICONS.shieldAlert}</span>
        <h4>Phishing Page Loaded!</h4>
        <p style="font-size:0.88rem; color:var(--text-muted); max-width:320px; margin:0 auto;">
          The user has been redirected from <strong style="color:var(--green)">trusted-bank.com</strong>
          to <strong style="color:var(--red)">${escapeHTML(maliciousUrl)}</strong>.
          <br><br>
          An attacker can host a spoofed login page here to harvest credentials or session tokens.
        </p>
      </div>
    `;

    resultBox.className = 'result-box result-box--danger';
    resultBox.innerHTML =
      `${ICONS.xCircle} <strong style="color:var(--red)">Exploited:</strong> The app blindly issued an HTTP 302 redirect to ` +
      `<code style="color:var(--red)">${escapeHTML(maliciousUrl)}</code>. ` +
      `The victim trusted the original link because it started with <code style="color:var(--green)">trusted-bank.com</code>.`;

    // Stream Critical Exploit Log
    orLogger.addLog({
      source: 'auditd:cwe-601',
      level: 'critical',
      isCritical: true,
      message: `<strong>CRITICAL SECURITY EVENT:</strong> Open redirect exploit dispatched! Server issued <code>HTTP 302 Found</code> to untrusted external destination <code>${escapeHTML(maliciousUrl)}</code>.`,
      detail: `Vulnerability: CWE-601 (URL Redirection to Untrusted Site). User session transitioned from trusted-bank.com to malicious third-party origin. High risk of credential harvesting and phishing amplification.`
    });

    showToast('Open redirect attack succeeded!', 'danger');
  }

  /* ---- Fixed redirect ---- */
  function handleFixedRedirect(maliciousUrl, label) {
    let hostname = '';
    try {
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

    lockIcon.innerHTML = ICONS.shieldCheck;
    urlText.innerHTML = `<span class="url-safe">${ICONS.shieldCheck} trusted-bank.com</span>/login — <span style="color:var(--green)">redirect blocked</span>`;

    simBody.innerHTML = `
      <div class="redirect-blocked active">
        <span class="shield-icon">${ICONS.shieldCheck}</span>
        <h4>Redirect Blocked!</h4>
        <p style="font-size:0.88rem; color:var(--text-muted); max-width:360px; margin:0 auto;">
          The server validated the <code style="color:var(--orange)">redirect</code> parameter and found that
          <strong style="color:var(--red)">${escapeHTML(hostname)}</strong> is not in the allowed domain whitelist.
        </p>
        <div style="margin-top:12px; text-align:left; width:100%; max-width:320px;">
          <p style="font-size:0.78rem; color:var(--text-dim); margin-bottom:6px;">Allowed domain whitelist:</p>
          <ul style="list-style:none; display:flex; flex-direction:column; gap:4px;">
            ${ALLOWED_DOMAINS.map(d =>
              `<li style="font-family:'JetBrains Mono',monospace; font-size:0.8rem; color:var(--green); padding:3px 8px; background:rgba(0,255,136,0.08); border-radius:4px; display:flex; align-items:center; gap:6px;">${ICONS.checkCircle} ${d}</li>`
            ).join('')}
          </ul>
          <p style="font-size:0.78rem; color:var(--red); margin-top:8px; font-family:'JetBrains Mono',monospace; display:flex; align-items:center; gap:6px;">
            ${ICONS.xCircle} ${escapeHTML(hostname)} — rejected
          </p>
        </div>
      </div>
    `;

    resultBox.className = 'result-box result-box--success';
    resultBox.innerHTML =
      `${ICONS.checkCircle} <strong style="color:var(--green)">Blocked:</strong> The server checked the redirect URL against an allowed domain whitelist. ` +
      `<code style="color:var(--red)">${escapeHTML(hostname)}</code> is not on the list, so the redirect was denied. ` +
      `The user stays safely on <code style="color:var(--green)">trusted-bank.com</code>.`;

    // Stream Defense Audit Logs
    orLogger.addLogsStaggered([
      {
        source: 'auth:service',
        level: 'info',
        message: 'User credentials authenticated. Processing redirect parameter.'
      },
      {
        source: 'waf:allowlist',
        level: 'audit',
        message: `Parsed destination hostname: "<code>${escapeHTML(hostname)}</code>" via URL constructor.`
      },
      {
        source: 'sec:enforce',
        level: 'blocked',
        message: `<strong>SECURITY AUDIT / BLOCKED:</strong> Destination host "<code>${escapeHTML(hostname)}</code>" is NOT in the domain whitelist. Redirection suppressed.`
      },
      {
        source: 'router:redirect',
        level: 'blocked',
        message: 'Enforced safe default: Redirecting user to internal home page <code>"/"</code> (HTTP 302).'
      }
    ], 100);

    showToast('Open redirect attempt blocked!', 'success');
  }

  /* ---- Reset ---- */
  function resetDemo() {
    lockIcon.innerHTML = '';
    urlText.innerHTML = '<span style="color:var(--text-dim)">Enter a URL or click a payload below</span>';
    simBody.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; padding:32px 16px; color:var(--text-dim); text-align:center;">
        ${ICONS.globe}
        <p style="font-size:0.9rem; margin:0;">Click a payload button below to simulate the attack</p>
      </div>
    `;
    resultBox.className = 'result-box';
    resultBox.innerHTML = '<span style="color:var(--text-dim)">Click a payload button above to run the demo.</span>';
  }
});
