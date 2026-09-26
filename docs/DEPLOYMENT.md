# DishaSaathi — Deployment & Operations Guide

This document describes the deployment architecture, configuration parameters, build procedures, and operational health checks for **DishaSaathi**.

---

## 1. System Architecture

DishaSaathi consists of two decoupled application tiers:

```text
Citizen Browser
      │
      ▼
Client Tier (Vite + React 19 + TypeScript)
      │  Reverse Proxy / Direct REST API
      ▼
Server Tier (Node.js + Express + TypeScript)
      │
      ├── Grounded Procedure Knowledge Base
      ├── Goal Parsing Engine (Gemini AI with Local Deterministic Fallback)
      ├── Dependency Validation Engine (Cycle & Precondition Checking)
      ├── Adaptive Recommendation Engine
      └── Civic Copilot (Structured Grounded RAG)
```

---

## 2. Prerequisites & System Requirements

- **Runtime**: Node.js `>= 18.0.0`
- **Package Manager**: npm `>= 9.0.0`
- **Memory**: Minimum 512 MB RAM (1 GB recommended)
- **Ports**:
  - Frontend: `5173` (development) or `80` / `443` (production web server)
  - Backend API: `5000` (configurable via `PORT` environment variable)

---

## 3. Environment Configuration

### Backend (`server/.env`):
```env
PORT=5000
NODE_ENV=production
CLIENT_URL=http://localhost:5173
# Optional: GEMINI_API_KEY=your_gemini_key_here
# If omitted or offline, the local deterministic regex parser handles entity extraction.
```

### Frontend (`client/.env`):
```env
# URL of the backend API server.
# In local development, Vite proxies /api to http://localhost:5000 automatically.
VITE_API_URL=http://localhost:5000
```

---

## 4. Build Commands

### Backend Build:
```bash
cd server
npm install
npm run build
```
- Output directory: `server/dist/`
- Compiles TypeScript via `tsc`.

### Frontend Build:
```bash
cd client
npm install
npm run build
```
- Output directory: `client/dist/`
- Produces production-optimized HTML, CSS, and JS bundles via Vite.

---

## 5. Running the Application

### Development Mode:
```bash
# Terminal 1 - Backend Server
cd server
npm run dev

# Terminal 2 - Frontend Client
cd client
npm run dev
```

### Production Mode:
```bash
# Start Server
cd server
npm start
# Runs: node dist/index.js

# Serve Client
# Serve client/dist using Nginx, Caddy, or static hosting (Vercel, Netlify, Cloudflare Pages)
```

---

## 6. Production Health Checks & Routing

### Health Check Endpoint:
- **URL**: `GET /api/health`
- **Expected Response**:
```json
{
  "status": "healthy",
  "service": "DishaSaathi API",
  "version": "1.0.0",
  "timestamp": "2026-09-26T14:26:00.000Z",
  "scenario": "Municipal Bureaucracy Path Visualizer (PSWB02)"
}
```

### Single Page Application (SPA) Fallback:
For production static web servers (Nginx/Cloudflare/Vercel), configure rewrite rules to redirect all unmatched routes to `index.html`:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## 7. Common Troubleshooting

| Issue | Cause | Resolution |
| :--- | :--- | :--- |
| `ECONNREFUSED :5000` | Backend server not running | Ensure `npm run dev` or `npm start` is executed in `server/`. |
| CORS Origin Blocked | Mismatched `CLIENT_URL` | Ensure `server/.env` contains the correct frontend domain, or verify Express CORS settings. |
| AI API Rate Limit / Timeout | Gemini API quota exhausted | No action needed; DishaSaathi automatically falls back to the deterministic local parser and verified knowledge base. |
| Stale LocalStorage State | Legacy schema cached in browser | DishaSaathi validates `DATA_VERSION = 1` and resets corrupted cache automatically; you can also click "Reset Demo" on the top toolbar. |
