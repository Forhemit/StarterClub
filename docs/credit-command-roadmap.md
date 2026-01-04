# CreditCommand Future Roadmap

> This document tracks features planned for future releases beyond the 1.0 MVP.

---

## 🎯 Version 1.0 (Current Sprint)
**Status:** In Development

| Feature | Module | Status |
|---------|--------|--------|
| Manual data entry | Both | ✅ Included |
| Simplified utilization heuristic | Personal | ✅ Included |
| Self-attestation compliance checks | Business | ✅ Included |
| Single business per user | Business | ✅ Included |
| Mobile-friendly UI (buttons/dropdowns) | Both | ✅ Included |

---

## 🚀 Version 2.0 — "Smart Data"
**Target:** Q2 2026

### Data Ingestion Enhancements

#### Option B: Direct API Integration
- **Plaid Integration** — Connect bank accounts for income/debt verification
- **Array** — Experian/TransUnion consumer credit data pull
- **Experian Connect** — Business credit bureau direct API
- **D&B Direct** — DUNS lookup and PAYDEX scores

> [!IMPORTANT]
> Requires business agreements with each data provider and compliance review.

#### Option C: PDF Parsing
- **Credit Report Upload** — Accept PDF uploads from Credit Karma, Experian, etc.
- **OCR/LLM Parsing** — Extract tradelines, scores, and account details automatically
- **Validation Layer** — Human review for ambiguous data

---

## 📜 Version 2.1 — "Dispute Engine"
**Target:** Q3 2026

### Dispute Letter Generation
- [ ] **609 Letter Templates** — FCRA-compliant validation request letters
- [ ] **Metro 2 Compliance Checker** — Flag formatting violations
- [ ] **Statute of Limitations Calculator** — State-by-state debt age warnings
- [ ] **Dispute Tracking Dashboard** — Status: Draft → Sent → Responded → Resolved
- [ ] **PDF Export** — Generate ready-to-mail dispute letters

### Letter Types
1. Basic 609 Validation Request
2. Method of Verification (MOV) Request
3. Obsolete Information Removal
4. Identity Theft Affidavit Package
5. Goodwill Adjustment Request

---

## 🏦 Version 3.0 — "Enterprise"
**Target:** Q4 2026

### Multi-Entity Support
- [ ] One user can manage **multiple business entities**
- [ ] Role-based access (CEO, CFO, Accountant roles)
- [ ] Team invitation system

### Advanced Analytics
- [ ] Score trend prediction (ML model)
- [ ] Optimal paydown strategy recommendations
- [ ] "Credit Health Score" composite metric

### Compliance Automation
- [ ] Secretary of State API integration (per state)
- [ ] 411.com automated listing verification
- [ ] Address consistency cross-check with USPS

---

## 🔐 Version 3.1 — "Security Hardening"
**Target:** Q1 2027

### Enhanced Security
- [ ] Supabase Vault for SSN/EIN encryption
- [ ] Zero-knowledge PDF storage
- [ ] Audit logging for all sensitive data access
- [ ] Two-factor authentication for credit data viewing

---

## 📊 Version 4.0 — "Score Simulation Pro"
**Target:** 2027

### Advanced Utilization Simulator
- [ ] Third-party score simulation API integration
- [ ] Account-by-account paydown recommendations
- [ ] "Statement Cut Date" optimization alerts
- [ ] Balance transfer impact modeling

### Acquisition Strategy
- [ ] Pre-qualification soft pull integrations
- [ ] Credit card recommendation engine (based on profile)
- [ ] Loan eligibility estimator

---

## 💡 Backlog (Unprioritized)

| Feature | Notes |
|---------|-------|
| Push notifications | Alert for score changes, payment due dates |
| Email digest | Weekly credit health summary |
| Gamification | "800 Club" and "No-PG Unlocked" badges |
| Dark mode credit dials | Enhanced visualization |
| Export to CSV/Excel | Tradeline data export |
| Investor-ready credit report | Formatted for due diligence |

---

*Last Updated: January 2, 2026*
