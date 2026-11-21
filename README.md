# SecLabs — Interactive Web Security Sandbox

[![OWASP Coverage](https://img.shields.io/badge/OWASP-A01%20%7C%20A03%20%7C%20A05-a855f7?style=flat-square)](#labs-breakdown)
[![CWE](https://img.shields.io/badge/CWE-601%20%7C%2079%20%7C%201021-ff4466?style=flat-square)](#labs-breakdown)

> 🚀 **Live Demo:** Experience the interactive security sandbox directly in your browser:  
> 🔗 **[https://professor606.github.io/42GraduationProject/](https://professor606.github.io/42GraduationProject/)**

A client-side interactive security sandbox featuring **three vulnerability labs**: Clickjacking, Open Redirect, and DOM Clobbering. Built with zero dependencies and zero backend, each lab provides hands-on attack payloads, live DOM inspection, and toggleable Vulnerable/Fixed defenses.

---

## Table of Contents

- [Overview](#overview)
- [Labs Breakdown](#labs-breakdown)
  - [Lab 1: Clickjacking (UI Redressing)](#lab-1-clickjacking-ui-redressing)
  - [Lab 2: Open URL Redirection](#lab-2-open-url-redirection)
  - [Lab 3: DOM Clobbering](#lab-3-dom-clobbering)
- [Architecture & Safety](#architecture--safety)
- [Project Structure](#project-structure)
- [Quick Start & Deployment](#quick-start--deployment)
- [Authors & Team](#authors--team)
- [Sources & References](#sources--references)

---

## Overview

Most web application security tutorials present vulnerabilities either as static code snippets or inside heavy Docker/VM environments. **SecLabs** bridges this gap by delivering **safe, zero-dependency, in-browser simulations**:

1. **Understand:** Plain-English explanations mapped to OWASP Top 10 and MITRE CWE.
2. **Inspect the Code:** Real-world implementations highlighting the flawed line causing the bug.
3. **Execute Payloads:** Interactive payload triggers that simulate the exploit directly in the DOM.
4. **Inspect the Damage:** Plain-English consequence analysis paired with documented real-world incidents.
5. **Verify the Fix:** Side-by-side hardened source code and a live toggle switch where identical payloads are blocked.

---

## Labs Breakdown

### Lab 1: Clickjacking (UI Redressing)
- **CWE Identifier:** [CWE-1021: Improper Restriction of Rendered UI Layers or Frames](https://cwe.mitre.org/data/definitions/1021.html)
- **OWASP Category:** `A05:2021 — Security Misconfiguration`
- **Mechanism:** The target page fails to restrict framing. An attacker loads it inside a transparent `<iframe>` (`opacity: 0.0001; z-index: 10`) positioned over an enticing decoy button ("Claim Prize"). Victim clicks land on hidden privileged controls ("Delete Account").
- **Interactive Sandbox:**
  - 3 decoy payload scenarios (`Special Reward`, `Play Video`, `Close Ad`).
  - Real-time opacity slider (0.0 to 1.0) to reveal the hidden framing deception.
- **The Defense:**
  - `Content-Security-Policy: frame-ancestors 'none';` (modern standard).
  - `X-Frame-Options: DENY` (legacy compatibility).

### Lab 2: Open URL Redirection
- **CWE Identifier:** [CWE-601: URL Redirection to Untrusted Site](https://cwe.mitre.org/data/definitions/601.html)
- **OWASP Category:** `A01:2021 — Broken Access Control`
- **Mechanism:** An unvalidated query parameter (`?redirect=...`) is passed directly to `res.redirect()`. Attackers use trusted brand domains in phishing links that redirect victims to credential-harvesting pages.
- **Interactive Sandbox:**
  - Simulated browser address bar rendering dynamic protocols, query strings, and SSL indicators.
  - 3 payloads: external domain (`https://evil-phishing.com`), protocol-relative scheme (`//attacker.com`), and `@`-sign trick (`trusted-bank.com@evil.com`).
- **The Defense:**
  - Native `URL` object parsing with strict domain allow-listing (`ALLOWED.includes(parsed.hostname)`).
  - Safe fallback default (`/`).

### Lab 3: DOM Clobbering
- **CWE Identifier:** [CWE-79: Improper Neutralization of Input During Web Page Generation](https://cwe.mitre.org/data/definitions/79.html)
- **OWASP Category:** `A03:2021 — Injection`
- **Mechanism:** Browsers expose HTML elements with `id` or `name` attributes as properties on `window`. When code uses fallback patterns like `window.defaultURL || fallback`, an attacker-injected tag (`<a id="defaultURL" ...>`) evaluates as truthy and clobbers the variable without any `<script>` tags.
- **Interactive Sandbox:**
  - Real-time DOM Inspector tracking variable states before and after injection.
  - 3 payloads: clobbering config object (`<img id="config">`), hijacking dynamic script URL (`<a id="defaultURL">`), and nested form properties (`<form id="settings">`).
- **The Defense:**
  - Lexical block scoping (`const`, `let`) inside modules or closures.
  - Runtime primitive type checking (`typeof candidate !== 'string'`).

---

## Architecture & Safety

- **100% Client-Side:** Zero backend, zero server processes, and zero database dependencies.
- **Safe Synthetic Targets:** All attack domains are safe mocks (`evil.com`, `evil-phishing.com`). No external network requests are dispatched.
- **Strict DOM Isolation:** Simulations run in memory without persistent browser storage pollution.

---

## Project Structure

```
.
├── index.html          # Portal home page with lab overviews and architecture breakdown
├── lab1.html           # Lab 1: Clickjacking simulation, opacity slider & defense toggle
├── lab2.html           # Lab 2: Open Redirect simulation, mock browser chrome & URL engine
├── lab3.html           # Lab 3: DOM Clobbering simulation, live DOM inspector & variable tracking
├── README.md           # Project documentation and guide
└── assets/
    ├── css/            # Cyberpunk dark theme, design system and per-lab stylesheets
    └── js/             # Interactive engines, state machines and simulated audit logger
```

---

## Quick Start & Deployment

### 🌐 Instant Access (Live Online Demo)
Run the sandbox directly in your browser without any setup:  
👉 **[https://professor606.github.io/42GraduationProject/](https://professor606.github.io/42GraduationProject/)**

### 💻 Local Run (Zero Build Tools)
Because SecLabs uses standard HTML5, CSS3, and ES6 JavaScript, it runs out of the box with any static file server:

```bash
# Clone the repository
git clone https://github.com/professor606/42GraduationProject.git
cd 42GraduationProject/vn

# Start a local web server (Python 3)
python3 -m http.server 8080

# Access the platform
open http://localhost:8080
```

---

## Authors & Team

This project was developed as a **42 Network Graduation Project** by:

- **Ahmad Abu Laban** — [LinkedIn](https://www.linkedin.com/in/ellprofessor)
- **Muhnnad Saed** — [LinkedIn](https://www.linkedin.com/in/mohnad-saed-796b05443)
- **Mahmoud Adih** — [LinkedIn](https://www.linkedin.com/in/mahmoud-adih-a42258412)
- **Osama AL-Sa'odi** — [LinkedIn](https://jo.linkedin.com/in/osama-al-sa-odi-415a161b0)
- **Zaid Almaiah** — [LinkedIn](https://www.linkedin.com/in/zaid-ziad-almaiah-219b28336/)

---

## Sources & References

- **Clickjacking:** [OWASP Clickjacking Defense](https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html) | [CWE-1021](https://cwe.mitre.org/data/definitions/1021.html) | [MDN X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)
- **Open Redirect:** [OWASP Unvalidated Redirects](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) | [CWE-601](https://cwe.mitre.org/data/definitions/601.html) | [PortSwigger Open Redirection](https://portswigger.net/kb/issues/00500100_open-redirection-reflected)
- **DOM Clobbering:** [OWASP DOM Clobbering Prevention](https://cheatsheetseries.owasp.org/cheatsheets/DOM_Clobbering_Prevention_Cheat_Sheet.html) | [CWE-79](https://cwe.mitre.org/data/definitions/79.html) | [HTML Living Standard: Named Access](https://html.spec.whatwg.org/multipage/window-object.html#named-access-on-the-window-object)
