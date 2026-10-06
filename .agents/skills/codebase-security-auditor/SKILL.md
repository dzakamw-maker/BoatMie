---
name: codebase-security-auditor
description: >-
  Audits codebase, dependencies, configurations, and IaC for security vulnerabilities,
  from critical RCE/auth bypasses down to the subtlest logic flaws and micro-leaks.
  Presents a structured, read-only report with unique IDs and diff proposals, then
  remediates approved findings safely via human-in-the-loop confirmation. Use whenever
  the user asks to pentest, audit security, hunt vulnerabilities, scan a project for flaws,
  or safely fix discovered security issues.
---

# Codebase Security Auditor & Remediation Guide

This skill provides an end-to-end framework for performing deep security audits and safe, human-in-the-loop remediations on any project, agnostic of framework or language.

---

## 1. Scope & Rules of Engagement

1. **Stack & Environment Auto-Detection**:
   - Inspect repository roots for manifests, package files, configs, and runtime files (e.g. `package.json`, `go.mod`, `Cargo.toml`, `requirements.txt`, `pom.xml`, `Dockerfile`, etc.).
   - Identify language(s), framework(s), database/BaaS layer (e.g. Firestore, PostgreSQL), runtime, package manager, and deployment targets before applying rules.

2. **Analysis Mode (Default: Read-Only)**:
   - Audit runs entirely read-only.
   - Do NOT edit code, do NOT run weaponized exploit scripts against live external systems, and do NOT alter configuration files during the audit phase.
   - Do NOT modify `.env`, production secrets, lockfiles, or CI/CD pipelines without explicit consent.

3. **No Guesswork & Confidence Scoring**:
   - Flag findings with explicit confidence levels:
     - `Confirmed`: Traced end-to-end in source code with undeniable risk.
     - `Likely`: Strong code pattern match, but depends on runtime environment variables or external infrastructure.
     - `Suspected`: Potential edge-case or architectural smell; requires runtime confirmation.
   - If an issue is ambiguous or out of visibility, state it honestly—never hallucinate vulnerabilities.

---

## 2. Core Security Checklists

### A. Secrets & Kredensial Bocor
- Scan source files, `.env.example`, `.env*`, config files, scripts, and git history for:
  - API keys, service tokens, private keys, database connection strings, webhook URLs.
  - Client bundle leaks: variables exposed via `NEXT_PUBLIC_*`, `VITE_*`, `REACT_APP_*` that contain privileged keys or secrets.

### B. Dependensi Rentan & Supply Chain
- Check active package dependencies against up-to-date vulnerability registries (OSV, GitHub Advisory Database, `npm audit`, `pip-audit`, etc.).
- If local audit tools cannot be executed, perform targeted web searches and record the check date.
- Inspect manifest scripts for typosquatting, suspicious postinstall scripts, and unpinned dependencies.

### C. Kelas Kerentanan Inti (OWASP Top 10 & CWE Top 25)
1. **Injection**: SQLi, NoSQLi, OS Command Injection, Server-Side Template Injection (SSTI), ORM/Query Injection, Log/Header Injection.
2. **Broken Access Control & IDOR/BOLA**:
   - Unauthenticated API endpoints, route handlers lacking session checks.
   - Missing object-level authorization (User A accessing User B's resource).
   - Insecure BaaS rules: Firestore / Supabase RLS policies that permit unauthorized read/writes or bypass validation via client SDKs.
3. **Authentication & Session Flaws**:
   - Hardcoded admin credentials, weak token validation, JWT algorithm confusion / missing signature check, improper session revocation.
4. **Cross-Site Scripting (XSS)**:
   - Reflected, stored, and DOM-based XSS; unescaped HTML injections (`dangerouslySetInnerHTML`, `v-html`, `innerHTML`).
5. **CSRF & SSRF**:
   - Missing anti-CSRF measures or unverified origins on state-changing requests.
   - Server-side outbound fetch/requests taking user-controlled URLs without IP/CIDR blocklists (especially cloud metadata `169.254.169.254` or internal LANs).
6. **Path Traversal & Insecure File Handling**:
   - Unsanitized file uploads, unrestricted extensions, path traversal via `../`, zip-slip.
7. **Insecure Deserialization & Weak Cryptography**:
   - Outdated hashing (MD5, SHA1 for passwords instead of bcrypt/argon2), insecure PRNG for tokens.

### D. Celah Mikro & Tersembunyi (Subtle / Deep Flaws)
1. **Race Conditions & TOCTOU**: Time-of-check to time-of-use flaws in rate limiters, inventory checks, multi-step wallet/state operations.
2. **Business Logic Abuse**: Workflow skipping, parameter tampering, negative amounts, replay attacks.
3. **Mass Assignment / Prototype Pollution**:
   - Unfiltered request payloads binding directly to ORM/database models or object spread (`Object.assign`, deep merge).
4. **Timing Attacks**: Non-constant-time string comparison for passwords, HMACs, or authentication secrets.
5. **ReDoS (Regular Expression Denial of Service)**: Catastrophic backtracking in regex processing user inputs.
6. **Information Disclosure**:
   - Verbose stack traces in API responses, leaking internal paths, overly broad CORS headers (`Access-Control-Allow-Origin: *` with credentials).

### E. Konfigurasi & Infrastruktur
- Security Headers: Content-Security-Policy (CSP), HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy.
- Cookies: `HttpOnly`, `Secure`, `SameSite` flags.
- Dockerfile, CI/CD workflows, permissions, and port exposures.

---

## 3. Two-Stage Audit Methodology

```
[Stage 1: Comprehensive Surface Scan]
  ├── Repository manifest, dependencies & secrets scan
  ├── Route, API endpoint & middleware discovery
  └── Configuration, headers & database rules review
                │
                ▼
[Stage 2: High-Risk Deep Dive]
  ├── Auth & Authorization boundaries (Admin panels, sessions, RBAC)
  ├── User input processing & data validation sinks
  ├── File, storage & network I/O paths
  └── Micro-flaws (Race conditions, mass assignment, logic leaks)
```

---

## 4. Mandatory Finding Report Format

Every finding must have a unique identifier (`SEC-001`, `SEC-002`, ...) and follow this strict markdown format:

```markdown
### [SEC-001] Nama Kerentanan Singkat & Jelas
- **Tingkat Keparahan**: Critical / High / Medium / Low / Info (CVSS v3.1: score)
- **Tingkat Keyakinan**: Confirmed / Likely / Suspected
- **Kategori**: [CWE-XXX / OWASP Top 10]
- **Lokasi**: `path/to/file.ext:baris_mulai-baris_selesai`

#### 🧠 Akar Masalah
Penjelasan ringkas 1-3 kalimat mengenai penyebab teknis celah ini terjadi di kode.

#### 🕵️ Skenario Eksploitasi (Konseptual)
Narasi ringkas bagaimana celah dapat disalahgunakan secara teoritis untuk memvalidasi risiko (tanpa kode payload senjata).

#### 💥 Dampak
Dampak teknis dan bisnis jika celah berhasil dimanfaatkan.

#### 🛠️ Usulan Patch (Diff)
```diff
- // kode rentan
+ // kode perbaikan aman
```
```

---

## 5. Human-in-the-Loop Remediation Protocol

After the audit report is delivered, follow this safe remediation procedure:

1. **Wait for User Approval**:
   - Do NOT apply code changes automatically.
   - Present the summary table of all findings.
   - Ask the user which findings they wish to remediate (e.g., "terapkan SEC-001, SEC-003", "terapkan semua Critical & High", atau "lewati SEC-005").

2. **High-Risk Confirmation Warning**:
   - If a finding touches:
     - Authentication or session handling
     - Database schema, security rules, or data migrations
     - Major dependency upgrades
     - Potential breaking changes
   - The agent MUST explicitly explain the behavioral impact and risk before requesting final confirmation to proceed.

3. **Safe Application on Git Branch**:
   - Ensure changes are made on a dedicated security branch (e.g., `git checkout -b security-fixes` or `security-fix/SEC-XXX`), NEVER directly on `main` / `master`.
   - Maintain one logical commit or atomic step per finding or approved batch so it can be reviewed and reverted cleanly.

4. **Protected Assets (Strictly Prohibited without Explicit Instruction)**:
   - Never overwrite active `.env` or secret keys (provide rotation guidelines instead).
   - Never edit package lockfiles manually without running proper package managers.
   - Never alter production deployment pipelines or CI/CD without direct approval.

5. **Post-Fix Verification**:
   - Run available linters, type checks, or build commands (e.g., `npm run build`, `npm test`, `pytest`, `cargo test`).
   - Re-check the modified lines to confirm the vulnerability is closed and no regression was introduced.
   - Report the verification outcome clearly back to the user.
