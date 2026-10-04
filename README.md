# KODEWAR Technologies

Enterprise software engineering, digital growth systems, and technological innovation.

---

## Repository Architecture

This repository is organized into a clean, decoupled frontend/backend structure:

```
KWT/
│
├── frontend/                     # Client-side React + Vite SPA
│   ├── public/                   # Static assets (images, team PNGs, videos, offers)
│   ├── src/
│   │   ├── components/           # UI components, common, navbar, footer, sections
│   │   ├── pages/                # Home, DigitalMarketing, Careers, Admin, Employee
│   │   ├── routes/               # AppRoutes routing architecture
│   │   ├── styles/               # Global and component stylesheets
│   │   ├── data/                 # Static mocks and configuration data
│   │   ├── layouts/              # MainLayout & AdminLayout wrappers
│   │   ├── context/              # AuthContext, ApplicationContext, PromotionContext
│   │   ├── lib/                  # Utilities (cn, tailwind-merge)
│   │   ├── App.jsx               # Root application component
│   │   └── main.jsx              # Vite entry point
│   ├── index.html                # HTML entry template
│   ├── vite.config.js            # Vite bundler configuration
│   └── package.json              # Frontend dependencies and build scripts
│
├── backend/                      # Server-side API & services
│   ├── src/
│   │   ├── config/               # Database, seed data, SQL schema & migrations
│   │   ├── middleware/           # Auth, rate limiting, upload, security headers
│   │   ├── routes/               # Express API route declarations (auth, jobs, apps, admin)
│   │   ├── services/             # Storage service abstraction (local/Supabase/R2)
│   │   └── server.js             # Express application entry point
│   ├── data/                     # Local file-backed database (kodewar.db.json)
│   ├── backups/                  # Sanitized timestamped JSON backups
│   ├── uploads/                  # Protected document storage directory
│   ├── scripts/                  # Backup CLI and PostgreSQL migration scripts
│   ├── package.json              # Backend dependencies and scripts
│   └── .env.example              # Backend environment template
│
├── docs/                         # Production audit reports and architectural docs
│   └── PRODUCTION_AUDIT.md       # Comprehensive code quality & security audit
├── DEPLOYMENT.md                 # Complete ₹0 budget free-tier deployment guide
├── package.json                  # Root orchestration scripts
├── .gitignore                    # Global repository gitignore
└── README.md                     # Project overview and documentation
```

---

## Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### 2. Development Setup
Install dependencies in both directories:
```bash
cd frontend && npm install
cd ../backend && npm install
```

Start the Backend API (default `http://localhost:5000`):
```bash
cd backend && npm start
```

Start the Frontend Dev Server (default `http://localhost:3000`):
```bash
cd frontend && npm run dev
```

---

## Automated Verification & Test Commands

To verify all system features, security guards, and data integrity:

```bash
# 1. Phase 6B: Candidate Auth, Profiles & Applications
node backend/test_verification.mjs

# 2. Phase 6C: Unified Admin Career Pipeline & Management
node backend/test_phase6c_verification.mjs

# 3. Phase 6D: Production Hardening, Security & Audit Suite
node backend/test_phase6d_hardening.mjs

# 4. Generate Safe PostgreSQL/Supabase Import Script
npm run db:migrate --prefix backend

# 5. Export Sanitized Database Backup Snapshot
npm run db:backup --prefix backend

# 6. Verify Production Frontend Build
npm run build --prefix frontend
```

---

## Production Deployment & Security

- Complete free-tier (₹0 budget) deployment instructions are documented in [DEPLOYMENT.md](DEPLOYMENT.md).
- Full security and quality audit findings are documented in [docs/PRODUCTION_AUDIT.md](docs/PRODUCTION_AUDIT.md).
