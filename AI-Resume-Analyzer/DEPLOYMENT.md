# Deployment Guide — ResumeAI

A practical guide for deploying the frontend to Vercel and the backend to Render (or Railway).

---

## How the pieces connect

```
User's browser
    │
    │  HTTPS
    ▼
Vercel (frontend — React/Vite static build)
    │
    │  POST /api/analyze   (HTTPS, cross-origin)
    ▼
Render / Railway (backend — Express.js)
    │
    │  HTTPS
    ▼
Google Gemini API
```

The frontend is a **static site** — just HTML/CSS/JS files. It has no server.
The backend is a **Node.js process** that runs 24/7 on a cloud server.

---

## 1. Deploy the backend (Render)

### Why Render?
Free tier, zero-config Node.js support, automatic deploys from GitHub.

### Steps

1. Push your project to GitHub (if not already).

2. Go to [render.com](https://render.com) → New → Web Service.

3. Connect your GitHub repo.

4. Configure the service:
   | Setting | Value |
   |---|---|
   | Root directory | `AI-Resume-Analyzer/backend` |
   | Runtime | Node |
   | Build command | `npm install` |
   | Start command | `npm start` |

5. Add environment variables (Render dashboard → Environment):
   ```
   NODE_ENV=production
   GEMINI_API_KEY=your_key_here
   FRONTEND_URL=https://your-app.vercel.app
   PORT=10000
   ```
   > Render sets PORT automatically — you can leave it out and the default (5000) works too.

6. Deploy. Render gives you a URL like `https://resumeai-backend.onrender.com`.

7. Test it: open `https://resumeai-backend.onrender.com/api/health` in your browser.
   You should see `{ "success": true, "message": "Backend is running" }`.

### Railway alternative
Same steps — Railway auto-detects Node.js. Set the same env vars in the Railway dashboard.

---

## 2. Deploy the frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) → New Project → Import your GitHub repo.

2. Configure:
   | Setting | Value |
   |---|---|
   | Root directory | `AI-Resume-Analyzer/frontend` |
   | Framework preset | Vite |
   | Build command | `npm run build` |
   | Output directory | `dist` |

3. Add environment variable (Vercel dashboard → Settings → Environment Variables):
   ```
   VITE_API_URL=https://resumeai-backend.onrender.com
   ```
   > This must be the exact URL Render gave you — no trailing slash.

4. Deploy. Vercel gives you a URL like `https://resumeai.vercel.app`.

5. Go back to Render and update `FRONTEND_URL` to `https://resumeai.vercel.app`.
   Redeploy the backend so the CORS change takes effect.

---

## 3. Environment variables explained

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | **Yes** | Your Google AI Studio API key |
| `NODE_ENV` | No | Set to `production` on the server |
| `PORT` | No | Port to listen on (default: 5000) |
| `FRONTEND_URL` | No | Comma-separated allowed CORS origins |
| `GEMINI_MODEL` | No | Override the default model name |
| `MOCK_AI` | No | Set to `true` to skip Gemini and return sample data |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | **Yes** | Full URL of your deployed backend |

> **Important:** Vite bakes env vars into the static build at build time.
> If you change `VITE_API_URL`, you must redeploy the frontend.

---

## 4. Common deployment mistakes

### "Failed to fetch" in the browser
- The frontend can't reach the backend.
- Check `VITE_API_URL` — it must be the exact Render URL, no trailing slash.
- Check that the backend is actually running (visit `/api/health`).

### CORS error in the browser console
- The backend is rejecting the frontend's origin.
- Make sure `FRONTEND_URL` on Render matches your Vercel URL exactly (including `https://`).
- After changing `FRONTEND_URL`, redeploy the backend.

### "GEMINI_API_KEY is not set" on startup
- The backend exits immediately if this variable is missing.
- Add it in the Render environment variables dashboard and redeploy.

### Render free tier "spinning up"
- Free Render services sleep after 15 minutes of inactivity.
- The first request after sleep takes ~30 seconds to respond.
- For a hackathon demo, open the `/api/health` URL before your presentation to wake it up.
- Upgrade to a paid plan ($7/month) to avoid cold starts.

### 429 Too Many Requests
- You've hit the Gemini API quota or the backend rate limiter.
- Gemini free tier: ~15 requests/minute. Wait a minute and retry.
- Backend rate limiter: 10 analyses per IP per 15 minutes (intentional — protects your quota).
- For demos: set `MOCK_AI=true` to bypass Gemini entirely.

---

## 5. Local development

```bash
# Terminal 1 — backend
cd AI-Resume-Analyzer/backend
cp .env.example .env        # fill in GEMINI_API_KEY
npm run dev                 # starts on http://localhost:5000

# Terminal 2 — frontend
cd AI-Resume-Analyzer/frontend
cp .env.example .env        # VITE_API_URL=http://localhost:5000
npm run dev                 # starts on http://localhost:5173
```

---

## 6. Pre-launch checklist

- [ ] Backend `/api/health` returns 200
- [ ] `GEMINI_API_KEY` is set on the server
- [ ] `FRONTEND_URL` on the backend matches the Vercel URL
- [ ] `VITE_API_URL` on the frontend matches the Render URL
- [ ] Upload a test PDF and confirm analysis works end-to-end
- [ ] Test with a non-PDF file — should get a clear error message
- [ ] Test with a file > 5MB — should get a size error
- [ ] Open the app on mobile — check layout
