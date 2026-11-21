/* ============================================================
   SecLabs — Shared JavaScript
   ============================================================ */

/* ---- Professional SVG Icons System ---- */
const ICONS = {
  shield: `<svg class="icon icon--cyan" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  shieldCheck: `<svg class="icon icon--green" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
  shieldAlert: `<svg class="icon icon--red" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  alertTriangle: `<svg class="icon icon--orange" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  lock: `<svg class="icon icon--green" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  lockOpen: `<svg class="icon icon--red" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`,
  mousePointer: `<svg class="icon icon--red" viewBox="0 0 24 24"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/></svg>`,
  redirect: `<svg class="icon icon--orange" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  domTree: `<svg class="icon icon--purple" viewBox="0 0 24 24"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M6 9v12"/><path d="m15 9-6 6"/><path d="M9 6h6"/></svg>`,
  globe: `<svg class="icon icon--cyan" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  bank: `<svg class="icon icon--cyan" viewBox="0 0 24 24"><line x1="3" y1="21" x2="21" y2="21"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="3 10 12 3 21 10"/><line x1="6" y1="10" x2="6" y2="21"/><line x1="10" y1="10" x2="10" y2="21"/><line x1="14" y1="10" x2="14" y2="21"/><line x1="18" y1="10" x2="18" y2="21"/></svg>`,
  zap: `<svg class="icon icon--orange" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  checkCircle: `<svg class="icon icon--green" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  xCircle: `<svg class="icon icon--red" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  info: `<svg class="icon icon--cyan" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  clock: `<svg class="icon icon--orange" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  target: `<svg class="icon icon--cyan" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  database: `<svg class="icon icon--cyan" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
  fileText: `<svg class="icon icon--cyan" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  fileCode: `<svg class="icon icon--purple" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="10 13 8 15 10 17"/><polyline points="14 13 16 15 14 17"/></svg>`,
  search: `<svg class="icon icon--cyan" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  sliders: `<svg class="icon icon--cyan" viewBox="0 0 24 24"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`,
  refresh: `<svg class="icon icon--sm" viewBox="0 0 24 24"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>`,
  copy: `<svg class="icon icon--sm" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  trash: `<svg class="icon icon--sm" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  terminal: `<svg class="icon icon--sm icon--cyan" viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
  arrowDown: `<svg class="icon icon--orange icon--lg" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>`,
  arrowRight: `<svg class="icon icon--sm" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  bookOpen: `<svg class="icon icon--xl icon--cyan" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  codeInspect: `<svg class="icon icon--xl icon--cyan" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`
};
window.ICONS = ICONS;

/* ---- Simulated Lab Log Viewer ---- */
class LabLogViewer {
  constructor(options) {
    this.containerId = options.containerId;
    this.labKey = options.labKey || 'lab';
    this.title = options.title || 'Security & Audit Logs';
    this.logs = [];
    this.filter = 'all'; // 'all' | 'critical'
    this.container = document.getElementById(this.containerId);
    this.init();
  }

  init() {
    if (!this.container) return;
    this.renderShell();
    this.bindEvents();
  }

  renderShell() {
    this.container.innerHTML = `
      <div class="log-terminal" id="${this.containerId}-terminal">
        <div class="log-terminal__header">
          <div class="log-terminal__left">
            <div class="log-terminal__dots">
              <span class="dot--red"></span>
              <span class="dot--yellow"></span>
              <span class="dot--green"></span>
            </div>
            <div class="log-terminal__title">
              ${ICONS.terminal}
              <span>${escapeHTML(this.title)}</span>
              <span class="log-terminal__badge log-terminal__badge--live">LIVE</span>
              <span class="log-terminal__badge log-terminal__crit-badge" id="${this.containerId}-crit-badge" style="display:none;">
                ${ICONS.shieldAlert} 0 CRITICAL
              </span>
            </div>
          </div>
          <div class="log-terminal__actions">
            <button type="button" class="log-btn log-filter-btn active" data-filter="all">All Logs</button>
            <button type="button" class="log-btn log-filter-btn" data-filter="critical">Critical Only</button>
            <button type="button" class="log-btn" id="${this.containerId}-copy-btn" title="Copy raw logs to clipboard">
              ${ICONS.copy} <span>Copy</span>
            </button>
            <button type="button" class="log-btn" id="${this.containerId}-clear-btn" title="Clear log window">
              ${ICONS.trash} <span>Clear</span>
            </button>
          </div>
        </div>
        <div class="log-terminal__body" id="${this.containerId}-body" role="log" aria-live="polite"></div>
      </div>
    `;
    this.bodyEl = document.getElementById(`${this.containerId}-body`);
    this.critBadge = document.getElementById(`${this.containerId}-crit-badge`);
  }

  bindEvents() {
    const filterBtns = this.container.querySelectorAll('.log-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filter = btn.dataset.filter;
        this.renderEntries();
      });
    });

    const copyBtn = document.getElementById(`${this.containerId}-copy-btn`);
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyLogs());
    }

    const clearBtn = document.getElementById(`${this.containerId}-clear-btn`);
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearLogs());
    }
  }

  getTimestamp() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const ms = String(now.getMilliseconds()).padStart(3, '0');
    return `${h}:${m}:${s}.${ms}`;
  }

  addLog(entry, scroll = true) {
    const logItem = {
      id: Date.now() + Math.random(),
      timestamp: entry.timestamp || this.getTimestamp(),
      source: entry.source || 'sys',
      level: entry.level || 'info', // 'info', 'warn', 'audit', 'critical', 'blocked'
      message: entry.message,
      isCritical: !!entry.isCritical,
      detail: entry.detail || null
    };
    this.logs.push(logItem);
    this.updateCritBadge();
    this.renderSingleEntry(logItem, scroll);
  }

  addLogsStaggered(entries, delay = 100) {
    entries.forEach((entry, idx) => {
      setTimeout(() => {
        this.addLog(entry, true);
      }, idx * delay);
    });
  }

  updateCritBadge() {
    const critCount = this.logs.filter(l => l.isCritical).length;
    if (this.critBadge) {
      if (critCount > 0) {
        this.critBadge.style.display = 'inline-flex';
        this.critBadge.innerHTML = `${ICONS.shieldAlert} ${critCount} CRITICAL ALERT${critCount > 1 ? 'S' : ''}`;
      } else {
        this.critBadge.style.display = 'none';
      }
    }
  }

  renderEntries() {
    if (!this.bodyEl) return;
    this.bodyEl.innerHTML = '';
    const visibleLogs = this.filter === 'critical' ? this.logs.filter(l => l.isCritical) : this.logs;
    if (visibleLogs.length === 0) {
      this.bodyEl.innerHTML = `<div style="color:var(--text-dim); text-align:center; padding:16px;">No logs matching filter "${escapeHTML(this.filter)}".</div>`;
      return;
    }
    visibleLogs.forEach(item => this.appendLogElement(item));
    this.bodyEl.scrollTop = this.bodyEl.scrollHeight;
  }

  renderSingleEntry(item, scroll = true) {
    if (this.filter === 'critical' && !item.isCritical) return;
    this.appendLogElement(item);
    if (scroll && this.bodyEl) {
      this.bodyEl.scrollTop = this.bodyEl.scrollHeight;
    }
  }

  appendLogElement(item) {
    if (!this.bodyEl) return;
    const div = document.createElement('div');
    div.className = `log-entry ${item.isCritical ? 'log-entry--critical' : ''}`;

    let levelClass = 'log-level--info';
    let levelText = 'INFO';
    if (item.level === 'warn') { levelClass = 'log-level--warn'; levelText = 'WARN'; }
    else if (item.level === 'audit') { levelClass = 'log-level--audit'; levelText = 'AUDIT'; }
    else if (item.level === 'critical') { levelClass = 'log-level--critical'; levelText = 'CRITICAL'; }
    else if (item.level === 'blocked' || item.level === 'fixed') { levelClass = 'log-level--blocked'; levelText = 'BLOCKED'; }

    let detailHtml = '';
    if (item.isCritical && item.detail) {
      detailHtml = `<span class="crit-detail"><strong>Vulnerability Trace:</strong> ${escapeHTML(item.detail)}</span>`;
    }

    div.innerHTML = `
      <span class="log-time">${escapeHTML(item.timestamp)}</span>
      <span class="log-source">[${escapeHTML(item.source)}]</span>
      <span class="log-level ${levelClass}">${levelText}</span>
      <span class="log-msg">
        ${item.isCritical ? `${ICONS.shieldAlert} ` : ''}${item.message}
        ${detailHtml}
      </span>
    `;
    this.bodyEl.appendChild(div);
  }

  clearLogs() {
    this.logs = [];
    this.updateCritBadge();
    if (this.bodyEl) {
      this.bodyEl.innerHTML = `<div style="color:var(--text-dim); text-align:center; padding:12px;">Logs cleared. Listening for runtime security events...</div>`;
    }
    showToast('Logs cleared', 'info');
  }

  copyLogs() {
    if (this.logs.length === 0) {
      showToast('No logs to copy', 'warning');
      return;
    }
    const text = this.logs.map(l =>
      `[${l.timestamp}] [${l.source}] [${l.level.toUpperCase()}] ${l.message.replace(/<[^>]+>/g, '')}${l.detail ? ` -- Details: ${l.detail}` : ''}`
    ).join('\n');

    navigator.clipboard.writeText(text).then(() => {
      showToast('Logs copied to clipboard', 'success');
    }).catch(() => {
      showToast('Failed to copy logs', 'danger');
    });
  }
}
window.LabLogViewer = LabLogViewer;

document.addEventListener('DOMContentLoaded', () => {
  /* ---- Mobile nav toggle ---- */
  const hamburger = document.querySelector('.nav__hamburger');
  const navLinks  = document.querySelector('.nav__links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded',
        navLinks.classList.contains('open'));
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav') && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on nav link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Scroll animations ---- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));

  /* ---- Active nav link ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage ||
       (currentPage === '' && href === 'index.html') ||
       (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});

/* ---- Toast notifications ---- */
function showToast(message, type = 'info') {
  // Remove existing toasts
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) toast.remove();
  }, 4000);
}

/* ---- Utility: escape HTML ---- */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* ---- Utility: sleep ---- */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
