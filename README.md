# SecLabs — Interactive Web Security Sandbox

[![Stack](https://img.shields.io/badge/Stack-Vanilla%20HTML5%20%7C%20CSS3%20%7C%20ES6+-00f0ff?style=flat-square)](#tech-stack)
[![Architecture](https://img.shields.io/badge/Architecture-100%25%20Client--Side%20%28Zero%20Backend%29-00ff88?style=flat-square)](#architecture--safety)
[![OWASP Coverage](https://img.shields.io/badge/OWASP-A01%20%7C%20A03%20%7C%20A05-a855f7?style=flat-square)](#labs-breakdown)
[![CWE](https://img.shields.io/badge/CWE-601%20%7C%2079%20%7C%201021-ff4466?style=flat-square)](#labs-breakdown)
[![License](https://img.shields.io/badge/License-MIT%20%2F%20Educational-ffd700?style=flat-square)](#license)

A browser-native, interactive security sandbox featuring **three client-side vulnerability labs**: Clickjacking, Open Redirect, and DOM Clobbering. Each lab offers a hands-on environment where security practitioners and developers can deploy attack payloads, observe real-time DOM/browser state alterations, inspect the underlying code, and evaluate robust remediation strategies with live Vulnerable/Fixed toggles.

---

## 📑 Table of Contents

- [Overview & Philosophy](#overview--philosophy)
- [Labs Breakdown](#labs-breakdown)
  - [Lab 1: Clickjacking (UI Redressing)](#lab-1-clickjacking-ui-redressing)
  - [Lab 2: Open URL Redirection](#lab-2-open-url-redirection)
  - [Lab 3: DOM Clobbering](#lab-3-dom-clobbering)
- [Interactive Features & Simulation Engine](#interactive-features--simulation-engine)
- [Architecture & Safety](#architecture--safety)
- [Project Structure](#project-structure)
- [Quick Start & Local Deployment](#quick-start--local-deployment)
- [Design System & UI/UX Standards](#design-system--uiux-standards)
- [Sources & References](#sources--references)
- [License](#license)

---

## 🎯 Overview & Philosophy

Most web application security tutorials present vulnerabilities either as static code snippets or inside heavy virtualization environments (Docker, cloud VMs). **SecLabs** bridges this gap by delivering **safe, zero-dependency, in-browser simulations**:

1. **Understand:** Concise plain-English explanations mapped to industry frameworks (OWASP Top 10, MITRE CWE).
2. **Inspect the Code:** Real-world implementations highlighting the single flawed line alongside the engineering reason behind the failure.
3. **Execute Payloads:** Interactive payload triggers that simulate the exploit directly in the DOM or a mock browser viewport.
4. **Inspect the Damage:** Detailed breakdowns of exploit consequences, paired with historical real-world incident citations.
5. **Verify the Fix:** Side-by-side hardened source code and a live toggle switch. The exact same attack payloads must fail against the fixed version.

---

## 🔬 Labs Breakdown

### Lab 1: Clickjacking (UI Redressing)
- **CWE Identifier:** [CWE-1021: Improper Restriction of Rendered UI Layers or Frames](https://cwe.mitre.org/data/definitions/1021.html)
- **OWASP Category:** `A05:2021 — Security Misconfiguration`
- **Mechanism:** The target web application fails to restrict framing via HTTP response headers. An adversary embeds the target inside a transparent `<iframe>` (`opacity: 0.0001; z-index: 10`) positioned over an enticing decoy element (e.g., "Claim Your Prize!"). User clicks aimed at the visible decoy land directly on privileged controls on the hidden page (e.g., "Delete My Account").
- **Interactive Sandbox Features:**
  - **Payload Suite:** Three decoy scenarios (`Claim Prize`, `Play Video`, `Close Ad`).
  - **Live Opacity Slider:** Real-time opacity controller (0.0 to 1.0) allowing users to drag the veil away and witness the deceptive alignment.
  - **Exploit Revelation:** Visual execution simulation detailing the hijacked user intent.
- **The Defense:**
  - `Content-Security-Policy: frame-ancestors 'none';` (modern standard).
  - `X-Frame-Options: DENY` (legacy browser compatibility).
  - Client-side frame-busting guard (`if (window.top !== window.self) window.top.location = window.self.location;`).

---

### Lab 2: Open URL Redirection
- **CWE Identifier:** [CWE-601: URL Redirection to Untrusted Site](https://cwe.mitre.org/data/definitions/601.html)
- **OWASP Category:** `A01:2021 — Broken Access Control`
- **Mechanism:** The authentication flow consumes a user-supplied target parameter (e.g., `?redirect=...`) and blindly invokes `res.redirect(target)` or client-side location assignment without host validation. Attackers use trusted brand domains to deliver believable links that ultimately land victims on adversary-controlled phishing portals.
- **Interactive Sandbox Features:**
  - **Browser Viewport Simulator:** Address bar rendering protocol, domain, query strings, and dynamic SSL lock/warning indicators.
  - **Payload Suite:**
    - Absolute external domain (`?redirect=https://evil-phishing.com/login`)
    - Protocol-relative bypass (`?redirect=//attacker.com/steal`)
    - Authority `@` sign obfuscation (`?redirect=trusted-bank.com@evil.com/fake`)
  - **State Transitions:** Simulated login flow transition into simulated malicious landing pages.
- **The Defense:**
  - Native `URL` object parsing with strict domain allow-listing (`allowedDomains.includes(parsed.hostname)`).
  - Rejection of protocol-relative schemes (`//`).
  - Safe fallback navigation defaults.

---

### Lab 3: DOM Clobbering
- **CWE Identifier:** [CWE-79: Improper Neutralization of Input During Web Page Generation](https://cwe.mitre.org/data/definitions/79.html)
- **OWASP Category:** `A03:2021 — Injection`
- **Mechanism:** Browsers historically expose named HTML elements (`id` or `name` attributes) as properties on the global `window` object. When applications rely on global variables without explicit declarations or rely on fallback lookups (`window.defaultURL || fallback`), attackers can inject harmless-looking HTML tags (allowed by HTML sanitizers like DOMPurify) to shadow the variable with an `HTMLElement` object.
- **Interactive Sandbox Features:**
  - **Injection Point Mapping:** Explains where user input enters (comments, profile bios, email renderers).
  - **Step-by-Step Flow Matrix:**
    1. *Injection:* Sanitizer permits markup lacking scripts or event handlers.
    2. *Window Collision:* Browser creates `window[elementId] = HTMLElement`.
    3. *Truthy Evaluation:* Object reference evaluates as truthy, short-circuiting defaults.
    4. *Property Hijacking:* String conversion (`anchor.toString()`) returns `.href`, directing script injection sinks to malicious endpoints.
  - **Payload Suite:**
    - `<img id="config">` — Clobbering application configuration objects.
    - `<a id="defaultURL" href="...">` — Hijacking dynamic script loader targets.
    - `<form id="settings"><input name="apiKey" value="...">` — Deep multi-level property clobbering.
  - **DOM Inspector:** Real-time Before/After variable inspection and DOM collision tracker.
- **The Defense:**
  - Lexical block scoping (`const`, `let`) inside modules or Immediately Invoked Function Expressions (IIFEs).
  - Runtime primitive type assertions (`typeof candidate === 'string'`).
  - Explicit exclusion of DOM elements (`!(val instanceof HTMLElement)`).

---

## 🛠️ Interactive Features & Simulation Engine

| Capability | Vulnerable Mode | Fixed Mode |
|---|---|---|
| **State Feedback** | Triggers visual attack confirmation, toast notifications, and DOM inspection updates. | Displays security defense mechanism, blocked status, and rationale. |
| **Code Highlighting** | Highlights the specific flaw (e.g., unvalidated redirect, missing CSP, global lookup). | Highlights the protective guard statement and type checks. |
| **Payload Persistence** | Re-running payloads demonstrates reproducible exploitation paths. | Re-running the identical payload verifies that the fix succeeds. |
| **Desktop / Mobile UI** | Single-row desktop payload tray, smooth scrolling, touch-optimized triggers. | Maintained across all viewport sizes. |

---

## 🔒 Architecture & Safety

- **Zero Backend / Serverless:** The application contains no server-side components, backend dependencies, or databases. All simulations occur entirely in client-side browser memory.
- **No External Network Calls:** Malicious URLs, phishing targets, and attack scripts are entirely synthetic (`evil.com`, `evil-phishing.com`, `attacker.com`). No network requests are made to external endpoints.
- **Strict Content Sandboxing:** Dynamic HTML injections are managed using isolated, non-executable sandbox elements and text encoding guards to prevent accidental execution outside the demonstration boundaries.
- **No Real Secrets:** No genuine credentials, API tokens, or authentic brand trademarks are used.

---

## 📁 Project Structure

```
/
├── index.html              # Home page: platform overview & lab selector
├── lab1.html               # Lab 1: Clickjacking (UI Redressing)
├── lab2.html               # Lab 2: Open URL Redirection
├── lab3.html               # Lab 3: DOM Clobbering
├── README.md               # Technical documentation & project guide
└── assets/
    ├── css/
    │   ├── style.css       # Core design system, variables, typography & layout
    │   ├── lab1.css        # Lab 1 specific: overlay masks, transparency controls
    │   ├── lab2.css        # Lab 2 specific: simulated browser chrome & URL bar
    │   └── lab3.css        # Lab 3 specific: DOM tree inspector & variable diff
    ├── js/
    │   ├── main.js         # Shared navigation, toast system & scroll animations
    │   ├── lab1.js         # Lab 1 interactive clickjacking engine
    │   ├── lab2.js         # Lab 2 browser redirect simulation engine
    │   └── lab3.js         # Lab 3 DOM clobbering state machine & diff inspector
    └── images/             # Static graphics & assets
```

---

## 🚀 Quick Start & Local Deployment

Because SecLabs is built with standard Web APIs, it runs out of the box with zero build tools, node modules, or compile steps.

### Option 1: Python HTTP Server (Recommended)
```bash
# Clone or navigate to the project directory
cd /home/aabu-lab/42GraduationProject/ahmad-test

# Start a local web server (Python 3)
python3 -m http.server 8080

# Access the platform
open http://localhost:8080
```

### Option 2: Node.js Static Server
```bash
# Using npx and serve
npx serve -l 8080 .
```

### Option 3: VS Code Live Server
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (`ritwickdey.liveserver`).
3. Right-click `index.html` and click **"Open with Live Server"**.

### Option 4: Direct File Loading
Open `index.html` directly in any modern browser (Chrome, Firefox, Safari, Edge):
```bash
open index.html
```

---

## 🎨 Design System & UI/UX Standards

The platform follows a dark cyberpunk/security operations aesthetic:

- **Color Palette:**
  - Deep Navy / Base: `#060b18`
  - Elevated Surfaces / Cards: `#0d1525` (Hover: `#111d33`)
  - Accent Cyan: `#00f0ff` (Glow: `rgba(0, 240, 255, 0.15)`)
  - Safe State Green: `#00ff88`
  - Vulnerability Alert Red: `#ff4466`
  - Warning Orange: `#ffaa00`
- **Typography:**
  - Interface: `Inter`, system-ui, sans-serif
  - Code & DOM Inspectors: `JetBrains Mono`, monospace
- **Glassmorphism:** Navigation bar featuring backdrop-filter blur (`24px`) with subtle alpha transparency.
- **Mobile First & Responsive:** Strict CSS grid and flexbox definitions ensuring full usability from 375px mobile viewports to 4K displays.

---

## 📚 Sources & References

1. **Clickjacking:**
   - [OWASP Clickjacking Defense Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html)
   - [MITRE CWE-1021: Improper Restriction of Rendered UI Layers](https://cwe.mitre.org/data/definitions/1021.html)
   - [MDN Web Docs: X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)
   - [MDN Web Docs: CSP: frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors)

2. **Open Redirect:**
   - [OWASP Unvalidated Redirects and Forwards Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)
   - [MITRE CWE-601: URL Redirection to Untrusted Site](https://cwe.mitre.org/data/definitions/601.html)
   - [PortSwigger Web Security Academy: Open Redirection](https://portswigger.net/kb/issues/00500100_open-redirection-reflected)

3. **DOM Clobbering:**
   - [OWASP DOM Clobbering Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_Clobbering_Prevention_Cheat_Sheet.html)
   - [PortSwigger Web Security Academy: DOM Clobbering](https://portswigger.net/web-security/dom-based/dom-clobbering)
   - [WHATWG HTML Living Standard: Named Access on the Window Object](https://html.spec.whatwg.org/multipage/window-object.html#named-access-on-the-window-object)
   - [Securitum Research: XSS in AMP4Email via DOM Clobbering](https://research.securitum.com/xss-in-amp4email-dom-clobbering/)
