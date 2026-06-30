# WICXA Backend — Updated with Admin Panel

## What changed
- `server.js`: your existing `/api/products` and `/api/orders` routes are untouched — your live frontend (App.tsx) keeps working exactly as before.
- Added `/api/admin/products` (CRUD) and `/api/admin/orders` (view) — protected by a secret key.
- Added `/admin` — a browser-based panel to add/edit/delete products and view incoming orders.
- Added `isActive` field to products (defaults to true) so you can hide a product without deleting it. Existing products without this field will still show, since the public route only excludes items explicitly set to `false`.

## Setup
1. Replace your current backend folder's files with these (or merge route/middleware/public folders in).
2. `npm install`
3. Copy `.env.example` → `.env`, fill in your real `MONGO_URI` and create a long random `ADMIN_SECRET_KEY`.
4. `npm run dev` locally, or deploy as you do now (e.g. Render).
5. Visit `https://your-backend-url/admin`, paste your `ADMIN_SECRET_KEY` into the Admin Key field, click Save.
6. Add products — name, price, category, description, plus upload images or paste image URLs.

## ⚠️ Important — image storage on Render
If you deploy this on Render's free tier (or most hosting platforms), **locally uploaded images will be deleted every time you redeploy**, because the disk isn't persistent. Two options:

- **Quick/manual**: paste direct image URLs (e.g. from Imgur, your own CDN, or anywhere you host images) into the "Image URLs" field instead of uploading — these aren't affected by redeploys.
- **Proper fix**: connect Cloudinary (free tier available) so uploaded images are stored permanently and reliably. I can wire this in for you — just ask.

## Your frontend (App.tsx)
No changes needed. It already calls `https://wicxa.onrender.com/api/products`, which still returns the same shape of data. New products you add through `/admin` will appear there automatically.

## Security notes
- Keep `ADMIN_SECRET_KEY` private — never commit `.env` to GitHub (it's already in your `.gitignore`).
- This uses a single shared secret for now. Before adding staff, swap this for real login + JWT + bcrypt-hashed passwords.
- Put `/admin` behind HTTPS in production (Render gives you this by default).

## Suggested next steps
- Move image storage to Cloudinary (recommended before relying on uploads in production)
- Add proper login instead of a shared secret key
- Add CSV bulk import for adding many products at once
