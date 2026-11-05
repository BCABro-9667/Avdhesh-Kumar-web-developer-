# Avdhesh Kumar Portfolio (Frontend + Backend)

A full-stack personal portfolio and CMS application built with **React + Vite** on the frontend and **Express + MongoDB** on the backend.

---

## ✨ Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS
- TanStack Query

### Backend
- Express + TypeScript
- MongoDB + Mongoose
- JWT authentication (admin)
- Cloudinary (media uploads)
- Razorpay / PhonePe integration

---

## 📁 Project Structure

```text
.
├── src/                 # Frontend source code
├── src/server/          # Backend helper modules (DB, auth, models, payments)
├── server.ts            # Main Express server + Vite integration
├── api/index.ts         # Serverless handler wrapper
├── public/              # Static assets
└── .env.example         # Environment variables template
```

---

## ✅ Prerequisites

- Node.js 20+
- npm (or bun lockfile compatible package manager)
- MongoDB database
- Cloudinary account (for uploads)

---

## ⚙️ Environment Setup

1. Copy env template:

```bash
cp .env.example .env
```

2. Fill required values in `.env`:

### Backend env vars
- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `ABSTRACT_EMAIL_API_KEY`
- Optional payments:
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
  - `PHONEPE_ENV`, `PHONEPE_MERCHANT_ID`, `PHONEPE_SALT_KEY`, `PHONEPE_SALT_INDEX`, `PHONEPE_HOST_URL`

### Frontend env vars
- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `GEMINI_API_KEY`
- `APP_URL`

---

## 🚀 Local Development

Install dependencies:

```bash
npm install
```

Run frontend + backend together (single dev server):

```bash
npm run dev
```

App runs on: **http://localhost:3000**

---

## 🧩 Frontend Instructions

- Frontend code is in `/src`
- Main entry: `src/main.tsx`
- App shell and routing state: `src/App.tsx`
- UI sections/components: `src/components`
- Pages: `src/pages`

For local frontend development:
1. Ensure `.env` has required `VITE_*` and API keys.
2. Start with `npm run dev`.
3. Update UI/components in `src/`.

---

## 🔐 Backend Instructions

- Main server: `server.ts`
- API base path: `/api/*`
- Backend modules: `src/server/*`
- Serverless adapter: `api/index.ts`

For local backend development:
1. Ensure `.env` has DB/auth/cloud variables.
2. Start with `npm run dev`.
3. Test API endpoints via `http://localhost:3000/api/...`.

---

## 📦 Build & Production

Build app:

```bash
npm run build
```

Start production build:

```bash
npm run start
```

Clean build artifacts:

```bash
npm run clean
```

Type-check:

```bash
npm run lint
```

---

## 🧪 Quick API Health Checks

- `GET /api/auth/diagnostic`
- `GET /api/projects`
- `GET /api/blog`
- `GET /api/gallery`
- `GET /api/settings`

---

## 📝 Notes

- The project uses a unified server in development (Express + Vite middleware).
- In serverless environments, `api/index.ts` exports the Express app handler.
