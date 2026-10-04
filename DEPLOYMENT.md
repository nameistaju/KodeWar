# KODEWAR Production Deployment & Hardening Guide (₹0 Budget)

This document provides a comprehensive, step-by-step guide to deploying the entire KODEWAR website, Career Portal, and Admin Management system to free-tier cloud infrastructure without spending any money (₹0 budget).

---

## 1. System Status & Readiness Matrix

| Component | Status | Target Free-Tier Host | Notes |
| :--- | :--- | :--- | :--- |
| **Frontend UI (React + Vite)** | `READY` | Vercel / Cloudflare Pages | Single-command deployment, zero cost, global edge CDN. |
| **Backend API (Node.js + Express)** | `READY` | Render / Railway / Fly.io | Hardened with security headers, CORS origin whitelist, and rate limiting. |
| **Local Development Database** | `READY` | Local filesystem | `backend/data/kodewar.db.json` with zero-setup auto-seeding. |
| **Production Persistent Database** | `READY` | Neon Serverless Postgres / Supabase | Standard connection string (`DATABASE_URL`), schema ready at `backend/src/config/schema.sql`. |
| **Resume & Asset Storage** | `READY` | Supabase Storage / Cloudflare R2 | S3-compatible / signed URL abstraction implemented in `backend/src/services/storageService.js`. |
| **Database Backup System** | `READY` | Built-in CLI | `npm run db:backup` exports timestamped, sanitized snapshots with redacted credentials. |
| **Candidate Local Auth (Email/Pass)** | `READY` | Local bcrypt + JWT | Robust sliding-window rate limiting on `/login` and `/signup`. |
| **Admin Management & RBAC** | `READY` | Local bcrypt + JWT | Strict 403 authorization guard on `/api/admin/*` endpoints. |
| **Health Check & Monitoring** | `READY` | Built-in | `GET /api/health` providing uptime, status, and environment diagnostics. |
| **Google OAuth Integration** | `PENDING CONFIGURATION` | Google Cloud Console | Client ID and secret must be obtained and configured in `.env`. |
| **Email Recovery / Notifications** | `PENDING CONFIGURATION` | Resend / SendGrid Free | Requires free API key for transactional emails. |

---

## 2. Architecture Overview

```
                      +-----------------------------+
                      |   Client Web Browser        |
                      +--------------+--------------+
                                     |
              +----------------------+----------------------+
              |                                             |
              v (HTTPS)                                     v (API Requests)
+----------------------------+               +------------------------------+
|   Vercel / Cloudflare      |               |      Render / Railway        |
|   Frontend CDN (Vite SPA)  |               |    Node.js Express Backend   |
+----------------------------+               +--------------+---------------+
                                                            |
                                             +--------------+---------------+
                                             |                              |
                                             v (SQL)                        v (Signed S3)
                              +----------------------------+  +----------------------------+
                              |   Neon / Supabase Postgres |  |   Supabase Storage / R2    |
                              |   (Persistent Relational)  |  |   (Candidate Resumes)      |
                              +----------------------------+  +----------------------------+
```

---

## 3. Step-by-Step Deployment Guide

### Step 3.1: Provision Persistent Database (Neon or Supabase - ₹0)
Free-tier compute instances (e.g., Render, Fly.io) feature **ephemeral filesystems**. When the server sleeps or restarts, local files are wiped. Therefore, production requires a persistent database:

1. **Option A: Neon Serverless Postgres (Recommended - 500MB free, instant setup)**:
   - Sign up at [neon.tech](https://neon.tech) (₹0 free tier).
   - Create a project: `kodewar-talent-prod`.
   - Copy your connection string: `postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require`.
   - In Neon SQL Editor, execute the contents of `backend/src/config/schema.sql` to initialize tables, indexes, constraints, and RLS policies.
   - Run `npm run db:migrate` in `backend` to generate `backend/src/config/seed_export.sql`. Execute it in Neon SQL Editor to import default jobs, training programs, and seed data idempotently.

2. **Option B: Supabase (500MB free, includes storage)**:
   - Sign up at [supabase.com](https://supabase.com).
   - Create project `kodewar-prod`.
   - Go to **SQL Editor** -> run `backend/src/config/schema.sql`.
   - Execute `backend/src/config/seed_export.sql` to import data safely without overwriting.
   - Obtain connection string from **Project Settings** -> **Database**.

---

### Step 3.2: Provision Resume Document Storage (Supabase / Cloudflare R2 - ₹0)
1. **Option A: Supabase Storage (1GB free storage)**:
   - In your Supabase Dashboard, create a **Private Bucket** named `resumes`.
   - Add Supabase credentials to your backend environment:
     - `STORAGE_PROVIDER=supabase`
     - `SUPABASE_URL=https://your-project.supabase.co`
     - `SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`
     - `SUPABASE_STORAGE_BUCKET=resumes`

2. **Option B: Cloudflare R2 (10GB free storage, $0 egress)**:
   - Create an R2 bucket in Cloudflare dashboard named `kodewar-resumes`.
   - Create R2 API Token with Object Read & Write permissions.
   - Configure in backend `.env`:
     - `STORAGE_PROVIDER=s3`
     - `S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com`
     - `S3_ACCESS_KEY_ID=...`
     - `S3_SECRET_ACCESS_KEY=...`
     - `S3_BUCKET=kodewar-resumes`

---

### Step 3.3: Deploy Backend API (Render - ₹0)
1. Push your repository to GitHub / GitLab.
2. Sign in to [render.com](https://render.com) and click **New Web Service**.
3. Connect your repository and select the **Root Directory**: `backend`.
4. Configure service parameters:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Plan**: `Free` ($0/mo)
5. Set Environment Variables in Render Dashboard:
   ```env
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=generate-a-cryptographically-secure-64-character-hex-string
   CORS_ORIGIN=https://kodewar.vercel.app,https://yourcustomdomain.com
   DATABASE_URL=postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require
   STORAGE_PROVIDER=local (or supabase / s3)
   ```
   > [!IMPORTANT]
   > Generate a strong production `JWT_SECRET` locally using:
   > ```bash
   > node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   > ```
   > If `NODE_ENV=production` and `JWT_SECRET` is unset or fewer than 32 characters, the backend **fails fast and terminates on startup**.

6. Click **Create Web Service**. Note your public URL (e.g., `https://kodewar-backend.onrender.com`).
7. Verify deployment by visiting `https://kodewar-backend.onrender.com/api/health`.

---

### Step 3.4: Deploy Frontend (Vercel - ₹0)
1. Sign in to [vercel.com](https://vercel.com) and click **Add New Project**.
2. Select your repository and set the **Root Directory** to `frontend`.
3. Framework Preset: **Vite**.
4. Configure Build & Output:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Configure Environment Variables:
   ```env
   VITE_APP_NAME=KODEWAR
   VITE_API_URL=https://kodewar-backend.onrender.com/api
   ```
6. Click **Deploy**. Vercel will build and assign a global edge CDN domain (e.g., `https://kodewar.vercel.app`).
7. Update Render's `CORS_ORIGIN` environment variable with your actual Vercel domain URL.

---

## 4. Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Default / Example | Purpose |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Optional | `development` / `production` | Enables production hardening, security headers, and error masking. |
| `PORT` | Optional | `5000` | Port for the Express server to listen on. |
| `JWT_SECRET` | **YES** | *Must be 32+ characters in production* | Secret key used to sign and verify candidate and admin JWTs. |
| `CORS_ORIGIN` | **YES** | `http://localhost:3000,http://localhost:5173` | Comma-separated whitelist of origins allowed to call the API. |
| `DATABASE_URL` | Optional | *Unset (uses local db.json)* | Standard PostgreSQL connection URL for Neon/Supabase persistence. |
| `STORAGE_PROVIDER` | Optional | `local` | Storage driver (`local`, `supabase`, `s3`). |
| `GOOGLE_CLIENT_ID` | Optional | *Pending Configuration* | Google OAuth Client ID for candidate social login. |
| `GOOGLE_CLIENT_SECRET`| Optional | *Pending Configuration* | Google OAuth Client Secret. |

### Frontend (`frontend/.env`)

| Variable | Required | Default / Example | Purpose |
| :--- | :--- | :--- | :--- |
| `VITE_APP_NAME` | Optional | `KODEWAR` | Application title display. |
| `VITE_API_URL` | **YES** | `http://localhost:5000/api` | Base URL pointing to the deployed backend Express server. |
| `VITE_GOOGLE_CLIENT_ID`| Optional | *Pending Configuration* | Client ID for Google Login button. |

---

## 5. Security & Protection Features

1. **Fail-Fast Boot Guard**:
   In `NODE_ENV=production`, if `JWT_SECRET` is unset, uses the dev default, or is under 32 characters, the server halts immediately (`process.exit(1)`).
2. **HTTP Hardening Headers**:
   - `X-Content-Type-Options: nosniff` (Prevents MIME sniffing attacks).
   - `X-Frame-Options: DENY` (Mitigates clickjacking).
   - `X-XSS-Protection: 1; mode=block` (Browser XSS filter).
   - `Referrer-Policy: strict-origin-when-cross-origin` (Protects user referrer privacy).
   - `Strict-Transport-Security: max-age=31536000` (Enforces HTTPS in production).
   - `X-Powered-By` hidden (Prevents server fingerprinting).
3. **Sliding-Window Rate Limiting**:
   - Auth endpoints (`/login`, `/signup`, `/forgot-password`): 15 attempts / 15 minutes per IP.
   - Upload endpoints: 30 requests / 15 minutes.
   - General API: 300 requests / 15 minutes.
4. **File Upload Hardening**:
   - Strict MIME & extension verification: only `.pdf`, `.doc`, and `.docx` are accepted.
   - Maximum upload size capped at 10MB per document.
   - File streams are isolated from public static file serving.
5. **Information Leakage Prevention**:
   - In production, internal error traces and server file paths are masked with generic client messages.
   - `admin_notes` are stripped from all candidate-facing application responses.
6. **Data Backups & Redaction**:
   - Run `npm run db:backup` inside `backend` at any time to generate a timestamped JSON snapshot in `backend/backups/`.
   - Passwords and sensitive credentials are automatically redacted to `[PROTECTED_HASH]`.

---

## 6. Verification & Automated Test Suites

To verify all system features before and after deployment, execute:

```bash
# 1. Verify Phase 6B (Candidate Auth, Profiles, Applications, Resume Streaming)
node backend/test_verification.mjs

# 2. Verify Phase 6C (Admin Jobs, Candidate Dossiers, Pipeline, Training, Testimonials)
node backend/test_phase6c_verification.mjs

# 3. Verify Phase 6D (Production Hardening, JWT Fail-Fast, CORS, Rate Limiting, Redaction)
node backend/test_phase6d_hardening.mjs

# 4. Verify Frontend Production Build
cd frontend && npm run build
```
