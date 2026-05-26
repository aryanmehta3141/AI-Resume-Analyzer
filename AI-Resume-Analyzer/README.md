# ResumeAI — AI-Powered Resume Analyzer

An AI-powered resume analyzer that gives instant ATS scoring, formatting feedback, keyword suggestions, and missing skills — all from a single PDF upload.

Built with React, Express.js, and the Gemini API.

![ResumeAI Screenshot](frontend/src/assets/hero.png)

---

## Features

- **ATS Score** — Realistic 0–100 score based on ATS compatibility, clarity, and structure
- **Formatting Suggestions** — Actionable tips on layout, sections, and readability
- **Keyword Improvements** — Role-relevant keywords you should add
- **Missing Skills** — Skills commonly expected for your field that aren't in your resume
- **Overall Feedback** — 2–4 sentence honest summary from the AI
- **Drag & Drop Upload** — PDF upload with client + server-side validation
- **Rate Limited** — Protected against API abuse (10 analyses / 15 min per IP)
- **Demo Mode** — Works without a Gemini key using `MOCK_AI=true`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Tailwind CSS 4, Vite 8 |
| Backend | Node.js, Express 5 |
| AI | Google Gemini API (`gemini-2.5-flash`) |
| PDF Parsing | `pdf-parse` v2 |
| File Upload | Multer (memory storage) |
| Rate Limiting | `express-rate-limit` |

---

## Project Structure

```
AI-Resume-Analyzer/
├── backend/
│   ├── config/
│   │   └── env.js                  # Startup env variable validation
│   ├── controllers/
│   │   └── analyze.controller.js   # Request handler — orchestrates PDF → AI → response
│   ├── middleware/
│   │   ├── error.middleware.js     # Centralized error handler
│   │   ├── rateLimit.middleware.js # Global + per-route rate limiters
│   │   └── upload.middleware.js    # Multer config + MIME + magic byte validation
│   ├── routes/
│   │   ├── analyze.routes.js       # POST /api/analyze
│   │   └── health.routes.js        # GET  /api/health
│   ├── services/
│   │   ├── ai.service.js           # Gemini integration, fallback chain, JSON parsing
│   │   └── pdf.service.js          # PDF text extraction
│   ├── utils/
│   │   └── prompt.js               # Gemini prompt template
│   ├── .env.example
│   └── server.js                   # Express app entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/             # Navbar, Footer
│   │   │   ├── sections/           # Hero, UploadSection, AnalysisResults, ...
│   │   │   └── ui/                 # Button, FeatureCard, GlowBackground, ...
│   │   ├── config/
│   │   │   └── api.js              # Backend URL config
│   │   ├── utils/
│   │   │   └── mapAnalysis.js      # API response normalizer
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── vite.config.js
│
├── DEPLOYMENT.md                   # Full deployment guide (Vercel + Render)
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/apikey) (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/AI-Resume-Analyzer.git
cd AI-Resume-Analyzer
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `backend/.env` and fill in your Gemini API key:

```env
GEMINI_API_KEY=your_key_here
```

Start the backend:

```bash
npm run dev
# Server running at http://localhost:5000
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000  ← already set correctly
npm run dev
# App running at http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173), upload a PDF resume, and click **Analyze resume**.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | **Yes** | — | Google AI Studio API key |
| `NODE_ENV` | No | `development` | Set to `production` on the server |
| `PORT` | No | `5000` | Port the server listens on |
| `FRONTEND_URL` | No | `http://localhost:5173` | Allowed CORS origin(s) — comma-separated for multiple |
| `GEMINI_MODEL` | No | `gemini-2.5-flash` | Override the default Gemini model |
| `MOCK_AI` | No | — | Set to `true` to skip Gemini and return sample data |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | **Yes** | `http://localhost:5000` | Full URL of the backend API |

---

## API Reference

### `GET /api/health`

Returns server status. Use this to verify the backend is running.

```json
{
  "success": true,
  "message": "Backend is running",
  "version": "full-pipeline-v1",
  "timestamp": "2026-05-26T10:00:00.000Z"
}
```

### `POST /api/analyze`

Analyzes a resume PDF.

**Request:** `multipart/form-data`
| Field | Type | Description |
|---|---|---|
| `resume` | File (PDF) | The resume to analyze. Max 5MB. |

**Success response (`200`):**
```json
{
  "success": true,
  "message": "Resume analyzed successfully",
  "data": {
    "fileName": "my-resume.pdf",
    "atsScore": 78,
    "formattingSuggestions": ["Use consistent section headings.", "..."],
    "keywordImprovements": ["Add role-specific keywords.", "..."],
    "missingSkills": ["AWS/GCP", "CI/CD tooling", "..."],
    "feedback": "Strong foundation. Add metrics to quantify your impact."
  }
}
```

**Error responses:**
| Status | Cause |
|---|---|
| `400` | No file, wrong file type, file too large, corrupted/image-only PDF |
| `422` | PDF parsed but contained no readable text (scanned image PDF) |
| `429` | Rate limit exceeded (10 analyses / 15 min per IP) |
| `502` | Gemini returned an unreadable response |
| `503` | `GEMINI_API_KEY` is not configured |
| `504` | Gemini request timed out (30s limit) |

---

## Security

- **CORS** — Only the configured `FRONTEND_URL` origin is allowed. Wildcard `*` is never used.
- **Rate limiting** — 200 req/15 min globally; 10 analyses/15 min on the analyze endpoint.
- **File validation** — Three layers: browser `accept` attribute → Multer MIME filter → PDF magic byte check (`%PDF` header). A renamed `.exe` or `.jpg` is rejected.
- **File size** — Hard 5MB limit enforced by Multer before the buffer is read.
- **Memory storage** — Files are held in RAM only, never written to disk. No cleanup needed.
- **Env validation** — Server refuses to start if `GEMINI_API_KEY` is missing.
- **Error sanitization** — In production, 500 errors return a generic message. Internal details stay in server logs only.

---

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full step-by-step guide covering:

- Deploying the backend to **Render** or **Railway**
- Deploying the frontend to **Vercel**
- Wiring `FRONTEND_URL` and `VITE_API_URL` together
- Common deployment mistakes and how to fix them
- Pre-launch checklist

**Quick summary:**

```
Frontend → Vercel
  VITE_API_URL = https://your-backend.onrender.com

Backend → Render
  GEMINI_API_KEY = your_key
  FRONTEND_URL   = https://your-app.vercel.app
  NODE_ENV       = production
```

---

## Demo Mode

If your Gemini quota is exceeded or you want to demo offline, add this to `backend/.env`:

```env
MOCK_AI=true
```

The backend will return a realistic sample analysis without calling Gemini at all.

---

## How It Works

```
1. User uploads PDF
        │
2. Multer parses multipart body
   → validates MIME type + magic bytes
   → stores buffer in memory (no disk write)
        │
3. pdf-parse extracts plain text from the buffer
        │
4. Text is injected into a structured Gemini prompt
   requesting strict JSON output
        │
5. Gemini returns JSON analysis
   → parsed, normalized, validated
        │
6. Backend returns flat JSON response
        │
7. Frontend maps response → renders
   ATS score ring + 3 suggestion cards
```

---

## License

MIT
