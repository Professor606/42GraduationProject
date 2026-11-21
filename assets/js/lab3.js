/* ============================================================
   Lab 3 — DOM Clobbering — Interactive Demo (Enhanced)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const toggle    = document.getElementById('dc-toggle');
  const vulnLabel = document.querySelector('.toggle__label--vuln');
  const fixLabel  = document.querySelector('.toggle__label--fix');
  const resultBox = document.getElementById('dc-result');
  const resetBtn  = document.getElementById('dc-reset');

  // DOM viewer elements
  const viewerBody = document.getElementById('dc-viewer-body');

  let isFixed = false;

  /* ---- Initialize Simulated Log Viewer ---- */
  const dcLogger = new LabLogViewer({
    containerId: 'dc-log-container',
    labKey: 'dom-clobbering',
    title: 'Client-Side DOM & JavaScript Runtime Audit (CWE-79)'
  });

  // Baseline startup logs
  dcLogger.addLog({
    source: 'browser:v8',
    level: 'info',
    message: 'ECMAScript execution context initialized. Window global scope active.'
  });
  dcLogger.addLog({
    source: 'html:sanitizer',
    level: 'info',
    message: 'Input sanitizer v3.1 registered. Config: strip <code>&lt;script&gt;</code>, strip <code>on*</code> event handlers, allow <code>id</code>/<code>name</code>.'
  });
  dcLogger.addLog({
    source: 'browser:dom',
    level: 'warn',
    message: 'DOM Named Access on Window object is active (HTML5 legacy behavior enabled).'
  });

  /* ---- Toggle handler ---- */
  toggle.addEventListener('change', () => {
    isFixed = toggle.checked;
    vulnLabel.style.color = isFixed ? 'var(--text-dim)' : 'var(--red)';
    fixLabel.style.color  = isFixed ? 'var(--green)' : 'var(--text-dim)';
    resetDemo();

    if (isFixed) {
      dcLogger.addLog({
        source: 'app:runtime',
        level: 'audit',
        message: 'Security policy reloaded: Block-scoped declarations & strict type assertions (<code>typeof candidate === \'string\'</code>) ENABLED.'
      });
      dcLogger.addLog({
        source: 'sec:enforce',
        level: 'blocked',
        message: 'Defense active: Injected DOM elements cannot override scoped variables or pass string type checks.'
      });
    } else {
      dcLogger.addLog({
        source: 'app:runtime',
        level: 'warn',
        message: 'Security policy downgraded: Global window fallback lookups active. Input susceptible to DOM clobbering.'
      });
      dcLogger.addLog({
        source: 'sec:policy',
        level: 'warn',
        message: 'Security posture downgraded: Vulnerability CWE-79 is active.'
      });
    }
  });

  /* ---- Payload buttons ---- */
  document.querySelectorAll('.dc-payload').forEach(btn => {
    btn.addEventListener('click', () => {
      const payload = btn.dataset.payload;
      const label   = btn.dataset.label;
      runPayload(payload, label);
    });
  });

  /* ---- Reset ---- */
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetDemo();
      dcLogger.addLog({
        source: 'sandbox:ctl',
        level: 'info',
        message: 'DOM Inspector & runtime variables reset to baseline.'
      });
    });
  }

  /* ---- Run a payload ---- */
  function runPayload(payloadHTML, label) {
    resetDemo();

    if (isFixed) {
      runFixed(payloadHTML, label);
    } else {
      runVulnerable(payloadHTML, label);
    }
  }

  /* ---- Vulnerable demo ---- */
  function runVulnerable(payloadHTML, label) {
    let beforeVal, afterVal, varName, injectionPoint, stepByStep, attackResult;

    // Create a sandboxed div to demonstrate clobbering
    const sandboxDiv = document.createElement('div');
    sandboxDiv.style.display = 'none';
    document.body.appendChild(sandboxDiv);

    switch (label) {
      case 'config': {
        varName = 'window.config';
        injectionPoint = 'User profile "About Me" field (allows limited HTML)';
        beforeVal = 'undefined (expected: app-defined object)';

        sandboxDiv.innerHTML = payloadHTML;
        const clobbered = sandboxDiv.querySelector('#config');
        afterVal = clobbered ? `[HTMLImageElement] → typeof = "object"` : 'undefined';
        attackResult = 'App crashes or misreads config — attacker can cause denial of service or redirect behavior';

        stepByStep = [
          { icon: ICONS.fileText, title: 'Injection', desc: `Attacker submits <code>${escapeHTML(payloadHTML)}</code> in a user profile field.` },
          { icon: ICONS.checkCircle, title: 'Sanitizer passes it', desc: `No <code>&lt;script&gt;</code>, no event handlers — the sanitizer sees nothing dangerous.` },
          { icon: ICONS.globe, title: 'Browser creates global', desc: `The browser auto-creates <code>window.config</code> → the <code>&lt;img&gt;</code> element.` },
          { icon: ICONS.zap, title: 'App reads clobbered value', desc: `Code that does <code>if (config) { use(config.url) }</code> now gets an HTMLImageElement instead of a JS object. <code>config.url</code> returns <code>undefined</code> — or the element's src attribute.` },
        ];
        break;
      }

      case 'url': {
        varName = 'window.defaultURL';
        injectionPoint = 'Comment section (HTML sanitizer strips scripts but allows links)';
        beforeVal = '"https://safe-cdn.myapp.com/analytics.js"';

        sandboxDiv.innerHTML = payloadHTML;
        const clobbered = sandboxDiv.querySelector('#defaultURL');
        afterVal = clobbered ? `"${clobbered.href}"  ← attacker's URL!` : 'undefined';
        attackResult = 'Attacker\'s script is loaded and executed in the app\'s context — full XSS';

        stepByStep = [
          { icon: ICONS.fileText, title: 'Injection', desc: `Attacker posts a comment containing <code>${escapeHTML(payloadHTML)}</code>` },
          { icon: ICONS.checkCircle, title: 'Sanitizer passes it', desc: `It's just an <code>&lt;a&gt;</code> tag — a normal link. The sanitizer allows it.` },
          { icon: ICONS.globe, title: 'Browser creates global', desc: `The browser auto-creates <code>window.defaultURL</code> → the <code>&lt;a&gt;</code> element.` },
          { icon: ICONS.zap, title: 'App loads attacker script', desc: `The app does <code>window.defaultURL || "safe-url"</code>. The element is <strong>truthy</strong>, so the fallback is skipped. When used as a string, the anchor's <code>.href</code> returns the attacker's URL. The app loads <code>https://evil.com/steal.js</code>.` },
        ];
        break;
      }

      case 'form': {
        varName = 'window.settings';
        injectionPoint = 'Email template editor (HTML subset allowed)';
        beforeVal = '{ apiKey: "sk-secret-123", endpoint: "https://api.myapp.com" }';

        sandboxDiv.innerHTML = payloadHTML;
        const form = sandboxDiv.querySelector('#settings');
        const apiKeyInput = form ? form.querySelector('[name="apiKey"]') : null;
        afterVal = form
          ? `[HTMLFormElement].apiKey → [HTMLInputElement].value = "${apiKeyInput ? apiKeyInput.value : ''}"`
          : 'undefined';
        attackResult = 'App sends API requests with the attacker\'s key — data exfiltration';

        stepByStep = [
          { icon: ICONS.fileText, title: 'Injection', desc: `Attacker inserts <code>${escapeHTML(payloadHTML)}</code> into an email template.` },
          { icon: ICONS.checkCircle, title: 'Sanitizer passes it', desc: `A <code>&lt;form&gt;</code> with an <code>&lt;input&gt;</code> — no script involved. Sanitizer allows it.` },
          { icon: ICONS.globe, title: 'Browser creates globals', desc: `<code>window.settings</code> → the <code>&lt;form&gt;</code> element. Named inputs inside a form become its properties, so <code>settings.apiKey</code> → the <code>&lt;input&gt;</code> element.` },
          { icon: ICONS.zap, title: 'App uses attacker value', desc: `Code reads <code>settings.apiKey</code> expecting a string <code>"sk-secret-123"</code>. Instead it gets an HTMLInputElement whose <code>.value</code> is <code>"ATTACKER_KEY"</code>. API calls now use the attacker's key.` },
        ];
        break;
      }
      default:
        document.body.removeChild(sandboxDiv);
        return;
    }

    // Clean up sandbox
    document.body.removeChild(sandboxDiv);

    // Render the DOM viewer with step-by-step breakdown using professional SVG icons
    viewerBody.innerHTML = `
      <div class="inject-area">
        <label style="display:flex; align-items:center; gap:6px;">
          ${ICONS.target}
          <span>Injection point: <strong style="color:var(--text)">${injectionPoint}</strong></span>
        </label>
        <textarea readonly style="margin-top:8px">${escapeHTML(payloadHTML)}</textarea>
      </div>

      <div style="margin-top:20px; margin-bottom:16px;">
        <h5 style="color:var(--cyan); font-size:0.82rem; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:12px;">
          Attack Execution Steps
        </h5>
        ${stepByStep.map((step, i) => `
          <div style="display:flex; gap:12px; padding:10px 14px; margin-bottom:6px; background:rgba(${i === stepByStep.length - 1 ? '255,68,102' : '0,240,255'},0.04); border-left:3px solid ${i === stepByStep.length - 1 ? 'var(--red)' : 'var(--cyan)'}; border-radius:0 var(--radius-xs) var(--radius-xs) 0;">
            <span style="font-size:1.1rem; flex-shrink:0;">${step.icon}</span>
            <div>
              <strong style="color:${i === stepByStep.length - 1 ? 'var(--red)' : 'var(--text)'}; font-size:0.85rem;">${step.title}</strong>
              <p style="font-size:0.83rem; color:var(--text-muted); margin-top:2px; line-height:1.6;">${step.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="var-state">
        <div class="var-state__box var-state__box--before">
          <h5>${ICONS.database} ${escapeHTML(varName)} — Before</h5>
          <div class="var-state__value">${escapeHTML(beforeVal)}</div>
        </div>
        <div class="var-state__box var-state__box--after">
          <h5>${ICONS.zap} ${escapeHTML(varName)} — After (Clobbered)</h5>
          <div class="var-state__value">${escapeHTML(afterVal)}</div>
        </div>
      </div>

      <div style="margin-top:16px; padding:12px 14px; background:rgba(255,68,102,0.08); border:1px solid rgba(255,68,102,0.3); border-radius:var(--radius-sm);">
        <p style="font-size:0.85rem; color:var(--red); margin:0;"><strong>Impact:</strong> ${escapeHTML(attackResult)}</p>
      </div>
    `;

    resultBox.className = 'result-box result-box--danger';
    resultBox.innerHTML =
      `${ICONS.xCircle} <strong style="color:var(--red)">Clobbered:</strong> <code style="color:var(--cyan)">${escapeHTML(varName)}</code> was overwritten by a DOM element. ` +
      `The app's JavaScript now reads an attacker-controlled value instead of the expected one.`;

    // Stream Simulated Attack Logs
    dcLogger.addLogsStaggered([
      {
        source: 'html:sanitizer',
        level: 'info',
        message: `Parsed input markup: <code>${escapeHTML(payloadHTML)}</code>. 0 prohibited tags identified. Allowed by sanitization rules.`
      },
      {
        source: 'browser:dom',
        level: 'warn',
        message: `Element inserted into DOM tree. Triggered Named Property Window Resolution algorithm.`
      },
      {
        source: 'browser:window',
        level: 'warn',
        message: `Property conflict detected: <code>${escapeHTML(varName)}</code> mapped directly to <code>${escapeHTML(afterVal)}</code>.`
      },
      {
        source: 'auditd:cwe-79',
        level: 'critical',
        isCritical: true,
        message: `<strong>CRITICAL SECURITY EVENT:</strong> DOM Clobbering exploit confirmed! Global runtime property <code>${escapeHTML(varName)}</code> shadowed by untrusted HTML node. Application control flow hijacked.`,
        detail: `Vulnerability: CWE-79 (DOM-Based Collision). Element attributes id/name bypassed sanitization and clobbered application variables without injecting a script tag. Result: ${attackResult}.`
      }
    ], 110);

    showToast('DOM Clobbering attack succeeded!', 'danger');
  }

  /* ---- Fixed demo ---- */
  function runFixed(payloadHTML, label) {
    let protectedVal, mechanism, varName, defenseSteps;

    switch (label) {
      case 'config':
        varName = 'config';
        protectedVal = '{ url: "https://safe-cdn.myapp.com/app.js", version: "2.1" }';
        mechanism = `<code>const config = Object.freeze({...})</code> inside a module or IIFE.`;
        defenseSteps = [
          'The <code>&lt;img id="config"&gt;</code> creates <code>window.config</code> (the DOM element).',
          'But the app uses <code>const config = ...</code> in a closure — block scope takes priority over <code>window</code>.',
          'The local <code>config</code> variable is resolved first. The DOM element on <code>window</code> is never reached.',
        ];
        break;
      case 'url':
        varName = 'defaultURL';
        protectedVal = '"https://safe-cdn.myapp.com/analytics.js"';
        mechanism = `<code>typeof window.defaultURL === 'string'</code> before using it.`;
        defenseSteps = [
          'The <code>&lt;a id="defaultURL"&gt;</code> creates <code>window.defaultURL</code> as an HTMLAnchorElement.',
          'The app checks: <code>typeof candidate !== "string"</code>.',
          'An HTMLAnchorElement has type <code>"object"</code>, not <code>"string"</code> — the check fails.',
          'The app falls back to the safe default URL.',
        ];
        break;
      case 'form':
        varName = 'settings';
        protectedVal = '{ apiKey: "sk-secret-123", endpoint: "https://api.myapp.com" }';
        mechanism = `<code>!(settings instanceof HTMLElement)</code> rejects DOM elements.`;
        defenseSteps = [
          'The <code>&lt;form id="settings"&gt;</code> creates <code>window.settings</code> as an HTMLFormElement.',
          'The app validates: <code>settings instanceof HTMLElement</code>.',
          'HTMLFormElement <strong>is</strong> an instance of HTMLElement — the check catches it.',
          'The app rejects the clobbered value and uses the safe default.',
        ];
        break;
      default:
        return;
    }

    viewerBody.innerHTML = `
      <div class="inject-area">
        <label>Attempted HTML payload:</label>
        <textarea readonly>${escapeHTML(payloadHTML)}</textarea>
      </div>

      <div style="margin-top:20px; margin-bottom:16px;">
        <h5 style="color:var(--green); font-size:0.82rem; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:12px;">
          Defense Steps
        </h5>
        ${defenseSteps.map((step, i) => `
          <div style="display:flex; gap:12px; padding:10px 14px; margin-bottom:6px; background:rgba(0,255,136,0.04); border-left:3px solid var(--green); border-radius:0 var(--radius-xs) var(--radius-xs) 0;">
            <span style="color:var(--green); font-weight:700; flex-shrink:0; font-size:0.85rem;">${i + 1}.</span>
            <p style="font-size:0.83rem; color:var(--text-muted); margin:0; line-height:1.6;">${step}</p>
          </div>
        `).join('')}
      </div>

      <div class="var-state">
        <div class="var-state__box var-state__box--safe">
          <h5>${ICONS.shieldCheck} ${escapeHTML(varName)} — Protected</h5>
          <div class="var-state__value">${escapeHTML(protectedVal)}</div>
        </div>
        <div class="var-state__box var-state__box--safe">
          <h5>${ICONS.checkCircle} Defense</h5>
          <div class="var-state__value" style="font-size:0.78rem;">${mechanism}</div>
        </div>
      </div>
    `;

    resultBox.className = 'result-box result-box--success';
    resultBox.innerHTML =
      `${ICONS.checkCircle} <strong style="color:var(--green)">Blocked:</strong> The injected element exists in the DOM but cannot override ` +
      `the app's <code style="color:var(--cyan)">${escapeHTML(varName)}</code> variable. Scoping and type guards ensure the clobbered value is rejected.`;

    // Stream Defense Audit Logs
    dcLogger.addLogsStaggered([
      {
        source: 'html:sanitizer',
        level: 'info',
        message: `Parsed input markup: <code>${escapeHTML(payloadHTML)}</code>. Appended to DOM tree.`
      },
      {
        source: 'browser:dom',
        level: 'info',
        message: `Named access created window reference.`
      },
      {
        source: 'app:guard',
        level: 'audit',
        message: `Applying defensive assertions: Checking candidate variable scope and type constraints.`
      },
      {
        source: 'sec:enforce',
        level: 'blocked',
        message: `<strong>SECURITY AUDIT / BLOCKED:</strong> Clobbered DOM reference rejected. Assertion <code>${mechanism}</code> defended application state. Fallback to constant applied.`
      }
    ], 100);

    showToast('DOM Clobbering attempt blocked!', 'success');
  }

  /* ---- Reset ---- */
  function resetDemo() {
    viewerBody.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; padding:40px 20px; color:var(--text-dim); text-align:center;">
        ${ICONS.target}
        <p style="font-size:0.9rem; margin:0;">Click a payload button below to run the demo</p>
      </div>
    `;
    resultBox.className = 'result-box';
    resultBox.innerHTML = '<span style="color:var(--text-dim)">Click a payload button above to run the demo.</span>';
  }
});
