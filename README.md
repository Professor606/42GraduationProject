# 🛡️ SecLabs — Interactive Web Security Labs

A front-end-only educational website featuring **three interactive security labs** where visitors can trigger real vulnerabilities, see the impact, and then apply the fix — all in the browser.

## 🔬 Labs

| # | Vulnerability | CWE | OWASP |
|---|---------------|-----|-------|
| 1 | **Clickjacking** | CWE-1021 | A05:2021 — Security Misconfiguration |
| 2 | **Open Redirect** | CWE-601 | A01:2021 — Broken Access Control |
| 3 | **DOM Clobbering** | CWE-79 | A03:2021 — Injection |

## 🚀 Getting Started

No build step, no backend, no dependencies.

```bash
# Option 1: Open directly in a browser
open index.html

# Option 2: Serve with any static server
python3 -m http.server 8080
# Then visit http://localhost:8080

# Option 3: Use VS Code Live Server
# Install the Live Server extension, right-click index.html → Open with Live Server
```

## 📁 Project Structure

```
/
├── index.html              # Home page — lab overview
├── lab1.html               # Clickjacking lab
├── lab2.html               # Open Redirect lab
├── lab3.html               # DOM Clobbering lab
├── README.md
└── assets/
    ├── js/
    │   ├── main.js          # Shared: nav, toast, utilities
    │   ├── lab1.js          # Clickjacking demo logic
    │   ├── lab2.js          # Open Redirect demo logic
    │   └── lab3.js          # DOM Clobbering demo logic
    ├── css/
    │   ├── style.css        # Global styles & design system
    │   ├── lab1.css         # Clickjacking-specific styles
    │   ├── lab2.css         # Open Redirect-specific styles
    │   └── lab3.css         # DOM Clobbering-specific styles
    └── images/              # (reserved for future use)
```

## 🎯 Each Lab Includes

1. **What it is** — Plain-English explanation with OWASP category and CWE number
2. **The vulnerable code** — 8–15 lines of realistic code with the dangerous line highlighted
3. **Try it** — 2–3 payload buttons that trigger the vulnerability in a live sandbox
4. **Why it matters** — Real-world impact with a cited incident
5. **The fix** — Fixed code with the fix line highlighted + a Vulnerable/Fixed toggle
6. **Sources** — OWASP, CWE, MDN, and research references

## 🛡️ Safety

- All demos are **client-side simulations** — no real attacks are performed
- No backend, no login, no database, no real credentials
- No real malicious code is executed
- No external sites are contacted during demos

## 💻 Tech Stack

- **HTML5** / **CSS3** / **Vanilla JavaScript**
- No frameworks, no build tools, no npm
- Google Fonts: Inter (UI) + JetBrains Mono (code)
- Fully responsive (mobile, tablet, desktop)

## 📄 License

Educational use only. All attacks are simulated for learning purposes.
