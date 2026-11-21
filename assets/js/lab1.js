/* ============================================================
   Lab 1 — Clickjacking — Interactive Demo
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const toggle       = document.getElementById('cj-toggle');
  const vulnLabel    = document.querySelector('.toggle__label--vuln');
  const fixLabel     = document.querySelector('.toggle__label--fix');
  const sandbox      = document.getElementById('cj-sandbox');
  const resultBox    = document.getElementById('cj-result');
  const resetBtn     = document.getElementById('cj-reset');

  let isFixed = false;

  /* ---- Initialize Simulated Log Viewer ---- */
  const cjLogger = new LabLogViewer({
    containerId: 'cj-log-container',
    labKey: 'clickjacking',
    title: 'HTTP & Browser Security Logs (CWE-1021)'
  });

  // Baseline startup logs
  cjLogger.addLog({
    source: 'syslog:daemon',
    level: 'info',
    message: 'Security auditing service v2.4 initialized. Monitoring HTTP response headers & DOM frame hierarchy.'
  });
  cjLogger.addLog({
    source: 'nginx/1.24.0',
    level: 'info',
    message: 'Worker process listening on 0.0.0.0:443 (TLSv1.3 ECDHE-RSA-AES256-GCM-SHA384).'
  });
  cjLogger.addLog({
    source: 'browser:sec',
    level: 'warn',
    message: 'Target origin policy: Missing <code>X-Frame-Options</code> and <code>Content-Security-Policy: frame-ancestors</code> headers.'
  });

  /* ---- Toggle handler ---- */
  toggle.addEventListener('change', () => {
    isFixed = toggle.checked;
    vulnLabel.style.color = isFixed ? 'var(--text-dim)' : 'var(--red)';
    fixLabel.style.color  = isFixed ? 'var(--green)' : 'var(--text-dim)';
    resetDemo();

    if (isFixed) {
      cjLogger.addLog({
        source: 'nginx/1.24.0',
        level: 'audit',
        message: 'Configuration reloaded: Added response headers <code>X-Frame-Options: DENY</code> and <code>Content-Security-Policy: frame-ancestors \'none\'</code>.'
      });
      cjLogger.addLog({
        source: 'sec:policy',
        level: 'blocked',
        message: 'Defense policy ACTIVE: Cross-origin iframe embedding strictly prohibited by browser policy.'
      });
    } else {
      cjLogger.addLog({
        source: 'nginx/1.24.0',
        level: 'warn',
        message: 'Configuration reloaded: Frame protection headers REMOVED. Target page open to framing.'
      });
      cjLogger.addLog({
        source: 'sec:policy',
        level: 'warn',
        message: 'Security posture downgraded: Vulnerability CWE-1021 is active.'
      });
    }
  });

  /* ---- Payload buttons ---- */
  document.querySelectorAll('.cj-payload').forEach(btn => {
    btn.addEventListener('click', () => {
      const payload = btn.dataset.payload;
      runPayload(payload);
    });
  });

  /* ---- Reset button ---- */
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetDemo();
      cjLogger.addLog({
        source: 'sandbox:ctl',
        level: 'info',
        message: 'Demo state reset to initial baseline.'
      });
    });
  }

  /* ---- Run a payload ---- */
  function runPayload(type) {
    resetDemo();

    if (isFixed) {
      runFixed(type);
    } else {
      runVulnerable(type);
    }
  }

  /* ---- Vulnerable demo ---- */
  function runVulnerable(type) {
    const targetPage = sandbox.querySelector('.cj-target');
    const overlay    = sandbox.querySelector('.cj-overlay');
    const reveal     = sandbox.querySelector('.cj-reveal');

    let baitText, baitBtn, actionText, revealMsg, payloadLabel;

    switch (type) {
      case 'prize':
        payloadLabel = 'Special Reward Offer';
        baitText     = 'Special Reward Available';
        baitBtn      = 'Claim Special Reward';
        actionText   = 'Delete My Account';
        revealMsg    = 'You thought you clicked "Claim Special Reward" — but your click hit "Delete My Account" on the hidden page underneath.';
        break;
      case 'video':
        payloadLabel = 'Exclusive Video Player';
        baitText     = 'Exclusive Video Access';
        baitBtn      = 'Play Video';
        actionText   = 'Transfer $1,000';
        revealMsg    = 'You clicked "Play Video" — but actually triggered "Transfer $1,000" on the transparent banking page behind the overlay.';
        break;
      case 'close':
        payloadLabel = 'Dismiss Advertisement Decoy';
        baitText     = 'Sponsored Advertisement';
        baitBtn      = 'Close [X]';
        actionText   = 'Enable Webcam';
        revealMsg    = 'You tried to close an ad — but that click went directly to the "Enable Webcam" permission button on the hidden page.';
        break;
      default:
        return;
    }

    // Set up target page
    targetPage.querySelector('h4').textContent = 'Account Settings';
    targetPage.querySelector('.cj-action-btn').textContent = actionText;

    // Set up overlay
    overlay.querySelector('h3').textContent = baitText;
    overlay.querySelector('p').textContent  = 'Click the button below to continue!';
    overlay.querySelector('.cj-bait-btn').textContent = baitBtn;
    overlay.classList.add('active');

    // Add pre-click simulation logs
    cjLogger.addLogsStaggered([
      {
        source: 'nginx:access',
        level: 'info',
        message: `198.51.100.42 - - "GET /settings HTTP/1.1" 200 4812 "https://attacker-domain.local/"`
      },
      {
        source: 'browser:frame',
        level: 'warn',
        message: `Embedded cross-origin resource loaded in &lt;iframe&gt; under parent "https://attacker-domain.local" with overlay decoy "${escapeHTML(payloadLabel)}".`
      },
      {
        source: 'browser:css',
        level: 'warn',
        message: 'CSS inspection warning: Computed iframe style <code>opacity: 0.0001; z-index: 10</code>. Hidden frame is intercepting pointer events.'
      }
    ], 90);

    // Handle bait click
    const baitBtnEl = overlay.querySelector('.cj-bait-btn');
    const handler = async () => {
      baitBtnEl.removeEventListener('click', handler);

      // Animate: fade overlay to show what's underneath
      overlay.style.transition = 'opacity 0.6s ease';
      overlay.style.opacity = '0.3';

      await sleep(800);
      overlay.classList.remove('active');
      overlay.style.opacity = '';
      overlay.style.transition = '';

      // Flash the target button
      const actionBtn = targetPage.querySelector('.cj-action-btn');
      actionBtn.style.boxShadow = '0 0 30px rgba(255, 68, 102, 0.6)';
      actionBtn.style.transform = 'scale(1.05)';

      await sleep(600);

      // Show reveal
      reveal.querySelector('h4').textContent = 'Clickjacked!';
      reveal.querySelector('p').textContent = revealMsg;
      reveal.classList.add('active');

      // Update result box with clean SVG icons
      resultBox.className = 'result-box result-box--danger';
      resultBox.innerHTML = `${ICONS.xCircle} <strong style="color:var(--red)">Exploited:</strong> ${escapeHTML(revealMsg)}`;

      // Stream critical attack logs
      cjLogger.addLog({
        source: 'browser:event',
        level: 'warn',
        message: `PointerEvent('click') dispatched at screen coordinates (X: 342, Y: 188) -> diverted to underlying control: <code>&lt;button class="cj-action-btn"&gt;${escapeHTML(actionText)}&lt;/button&gt;</code>`
      });

      cjLogger.addLog({
        source: 'auditd:cwe-1021',
        level: 'critical',
        isCritical: true,
        message: `<strong>CRITICAL SECURITY EVENT:</strong> Clickjacking exploit executed! Involuntary user action hijacked by invisible iframe overlay. Triggered privileged operation <code>POST /api/account/execute [${escapeHTML(actionText)}]</code> without user visual awareness.`,
        detail: `Vulnerability: CWE-1021 (Improper Restriction of Rendered UI Layers). Target page sent no X-Frame-Options or frame-ancestors headers. Attacker decoy "${baitBtn}" hijacked victim intent.`
      });

      showToast('Clickjacking attack succeeded!', 'danger');
    };

    baitBtnEl.addEventListener('click', handler);

    resultBox.className = 'result-box';
    resultBox.innerHTML = `${ICONS.clock} <span style="color:var(--orange)">Click the bait button in the sandbox above to trigger the clickjack...</span>`;
  }

  /* ---- Fixed demo ---- */
  function runFixed(type) {
    const blocked = sandbox.querySelector('.cj-blocked');
    const targetPage = sandbox.querySelector('.cj-target');
    const overlay = sandbox.querySelector('.cj-overlay');

    let payloadName;
    switch (type) {
      case 'prize':  payloadName = '"Special Reward" overlay'; break;
      case 'video':  payloadName = '"Play Video" overlay'; break;
      case 'close':  payloadName = '"Close Ad" overlay'; break;
      default: return;
    }

    // Hide target, show blocked
    targetPage.style.display = 'none';
    overlay.classList.remove('active');
    blocked.classList.add('active');
    blocked.querySelector('h4').textContent = 'Framing Blocked!';
    blocked.querySelector('p').textContent =
      `The ${payloadName} attempted to frame this page, but the X-Frame-Options: DENY header and CSP frame-ancestors 'none' directive prevented it. The browser refused to render the page inside an iframe.`;

    resultBox.className = 'result-box result-box--success';
    resultBox.innerHTML =
      `${ICONS.checkCircle} <strong style="color:var(--green)">Blocked:</strong> The page cannot be embedded in an iframe. ` +
      `The browser enforces <code style="color:var(--cyan)">X-Frame-Options: DENY</code> and ` +
      `<code style="color:var(--cyan)">Content-Security-Policy: frame-ancestors 'none'</code>, so the clickjacking overlay has nothing to display.`;

    // Stream defense audit logs
    cjLogger.addLogsStaggered([
      {
        source: 'nginx:access',
        level: 'info',
        message: `198.51.100.42 - - "GET /settings HTTP/1.1" 200 4812 "https://attacker-domain.local/"`
      },
      {
        source: 'browser:csp',
        level: 'audit',
        message: 'Evaluating CSP directive: <code>frame-ancestors \'none\'</code> against ancestor hierarchy [https://attacker-domain.local].'
      },
      {
        source: 'sec:enforce',
        level: 'blocked',
        message: `<strong>SECURITY POLICY ENFORCED:</strong> Refused to frame 'https://simulated-target-page.com/settings' because an ancestor violates Content Security Policy: <code>frame-ancestors 'none'</code>.`
      },
      {
        source: 'browser:sec',
        level: 'blocked',
        message: `Iframe instantiation aborted: <code>X-Frame-Options: DENY</code> prevented embedding. Attack payload neutralized.`
      }
    ], 110);

    showToast('Clickjacking attempt blocked!', 'success');
  }

  /* ---- Reset demo ---- */
  function resetDemo() {
    const targetPage = sandbox.querySelector('.cj-target');
    const overlay    = sandbox.querySelector('.cj-overlay');
    const reveal     = sandbox.querySelector('.cj-reveal');
    const blocked    = sandbox.querySelector('.cj-blocked');

    targetPage.style.display = '';
    targetPage.querySelector('.cj-action-btn').style.boxShadow = '';
    targetPage.querySelector('.cj-action-btn').style.transform = '';
    overlay.classList.remove('active');
    overlay.style.opacity = '';
    overlay.style.transition = '';
    reveal.classList.remove('active');
    blocked.classList.remove('active');

    resultBox.className = 'result-box';
    resultBox.innerHTML = '<span style="color:var(--text-dim)">Click a payload button above to run the demo.</span>';
  }

  /* ---- Opacity slider for education ---- */
  const opacitySlider = document.getElementById('cj-opacity');
  if (opacitySlider) {
    opacitySlider.addEventListener('input', (e) => {
      const overlay = sandbox.querySelector('.cj-overlay');
      if (overlay.classList.contains('active')) {
        overlay.style.transition = 'none';
        overlay.style.opacity = e.target.value;
      }
    });
    opacitySlider.addEventListener('change', () => {
      const overlay = sandbox.querySelector('.cj-overlay');
      overlay.style.transition = '';
    });
  }
});
