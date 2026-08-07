# Deployment Guide

This repo is a Vite/React frontend (hosted on Vercel) plus a Django REST API
(`backend/`). The **admin panel saves everything to the Django API**, so for
admin edits to survive on the live site you must deploy the backend too.

## Architecture

```
Phone/Desktop
   │
   ├─ https://fpc-website.vercel.app   (React, Vercel)
   │     └─ GET/POST  /api/...  ──────────────►  https://fpc-backend.onrender.com   (Django, Render)
   │                                              ├─ PostgreSQL (Render free DB)   ← data
   │                                              └─ Cloudinary (image uploads)    ← photos
   └─ <img src="https://res.cloudinary.com/...">  (photos served from Cloudinary CDN)
```

Everything is configured. You only need to (1) create a free Cloudinary account,
(2) deploy `render.yaml` on Render, and (3) set `VITE_API_URL` on Vercel.

---

## Step 1 — Cloudinary (for photo uploads)

1. Sign up free at https://cloudinary.com (no credit card).
2. Open the Dashboard → your **Product Environment** gives a
   `CLOUDINARY_URL` that looks like:
   `cloudinary://123456789012345:AbCdEfGhIjKlMnOpQrStUvWxYz@your-cloud-name`
3. Copy it — you'll paste it into Render in the next step.

> Uploads are stored on Cloudinary, not Render, so they survive redeploys.

---

## Step 2 — Deploy the backend on Render

1. Push this repo to GitHub (it should already be there).
2. Open https://dashboard.render.com → **New** → **Blueprint**.
3. Pick your repo. Render finds `render.yaml` and offers a preview.
4. When prompted for **CLOUDINARY_URL**, paste the value from Step 1.
5. Click **Apply / Deploy Blueprint**.

Render creates two resources automatically:
- a **free PostgreSQL** database (`fpc-db`)
- a **web service** (`fpc-backend`) that on first boot runs
  `migrate` + `seed` (creates the demo admin/editor users and default content),
  then starts `gunicorn`.

After the build finishes, open
`https://fpc-backend.onrender.com/api/members/` — you should see a JSON list of
15 members. If not, check the service Logs tab.

### Optional: change the demo passwords
On the web service **Environment** tab, set `ADMIN_PASSWORD` and
`EDITOR_PASSWORD`, then click **Manual Deploy → Deploy latest commit**. Note:
the admin login screen shows the default demo credentials, so update that hint
if you change them.

> Free tier note: the service sleeps after ~15 min of inactivity. The first
> request after sleep takes 10–30 s to wake up (cold start).

---

## Step 3 — Point Vercel at the backend

1. Open your project on https://vercel.com → **Settings → Environment Variables**.
2. Add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://fpc-backend.onrender.com`
   - Environment: **Production** (and Preview if you want previews wired up).
3. **Deploy** (or open **Deployments → Redeploy**).

If `VITE_API_URL` is unset the app falls back to the same origin and the Vite
dev proxy, so local development (`npm run dev`) is unchanged.

---

## Step 4 — Verify

1. Open the deployed site, click the logo 5× to open the admin panel
   (or log in normally).
2. Sign in as `admin` / `Fpc@admin2026`.
3. Make a change (e.g. edit the motto or upload a photo) and Save.
4. Hard-refresh the site — the change should be there, because it's stored in
   the shared PostgreSQL database.
5. Visit the site from your phone (logged out) — the change is visible to
   everyone.

---

## Notes

- **Local dev is unchanged**: `npm run dev` + `python manage.py runserver` still
  use the Vite proxy and SQLite.
- **Existing local edits are not copied automatically.** Anything you changed in
  your *local* database is only on your computer. Either redo those edits in the
  production admin panel, or run a one-off script to dump/upload them.
- **Django admin** (`/admin/` on Render) is available using the same
  admin credentials, but the site has its own admin panel, so you don't need it.
- **Troubleshooting CORS / 404s**: confirm `VITE_API_URL` is set on Vercel and
  includes no trailing slash, and that `CORS_ALLOWED_ORIGINS` on Render includes
  your Vercel URL (defaults to `https://fpc-website.vercel.app`).
