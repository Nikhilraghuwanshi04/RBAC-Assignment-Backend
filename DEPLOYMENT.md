# Deployment Guide - Secure Gate RBAC Portal

This guide provides step-by-step instructions to deploy your backend REST API and Next.js frontend to the cloud for free.

---

## 🏗️ Deployment Architecture

1. **Database**: MongoDB Atlas (already hosted in the cloud, we will reuse your connection string).
2. **Backend REST API (Node/Express)**: Hosted on **Render** (free/cheap Node hosting).
3. **Frontend Dashboard (Next.js)**: Hosted on **Vercel** (free Next.js hosting, auto-optimized).

---

## 📦 Step 1: Push Your Code to GitHub

1. Initialize a Git repository in the project folder (if not done already):
   ```bash
   git init
   ```
2. Create a `.gitignore` in the root (if not present) to prevent uploading `node_modules`, `.next`, and `.env` files:
   ```text
   node_modules/
   dashboard/.next/
   dashboard/node_modules/
   .env
   ```
3. Add files and commit:
   ```bash
   git add .
   git commit -m "feat: complete Next.js migration and REST API setup"
   ```
4. Create a new repository on GitHub and link it:
   ```bash
   git remote add origin https://github.com/your-username/rbac-otp-backend.git
   git branch -M main
   git push -u origin main
   ```

---

## 🚀 Step 2: Deploy Backend on Render (render.com)

Render hosts Node.js applications directly from GitHub for free.

1. Sign up/Log in to **[Render](https://render.com/)**.
2. Click **New +** and select **Web Service**.
3. Link your GitHub account and select your `rbac-otp-backend` repository.
4. Set up the service details:
   - **Name**: `rbac-gate-backend` (or any name you prefer)
   - **Environment**: `Node`
   - **Region**: Select the closest region to your database location (e.g., Oregon, Singapore).
   - **Branch**: `main`
   - **Root Directory**: Leave blank (representing the root directory)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add your **Environment Variables** (click *Advanced* -> *Add Environment Variable*):
   - `MONGODB_URI` = `your_mongodb_atlas_connection_string`
   - `JWT_SECRET` = `your_secure_secret_signing_key`
   - `JWT_EXPIRES_IN` = `1d`
   - `ALLOWED_ORIGIN` = `https://your-frontend-vercel-url.vercel.app` (You can update this after deploying the frontend on Vercel!).
6. Click **Create Web Service**.
7. Render will build and deploy the backend. Once active, it will give you a public URL (e.g., `https://rbac-gate-backend.onrender.com`).

---

## ⚡ Step 3: Deploy Frontend on Vercel (vercel.com)

Vercel is built by the creators of Next.js and integrates directly with Next.js projects.

1. Sign up/Log in to **[Vercel](https://vercel.com/)**.
2. Click **Add New** and select **Project**.
3. Import your `rbac-otp-backend` repository.
4. Configure Project Settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click *Edit* and select the **`dashboard`** folder.
5. Add **Environment Variables**:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-render-url.onrender.com` (Use the URL given by Render in Step 2).
6. Click **Deploy**.
7. Vercel will compile the Next.js Turbopack build and deploy it. Within a minute, it will provide your dashboard URL (e.g., `https://dashboard-three.vercel.app`).

---

## 🔄 Step 4: Final Linkage

1. Take the Vercel URL (e.g., `https://dashboard-three.vercel.app`).
2. Go to your Render Dashboard -> Select your Web Service -> **Environment**.
3. Edit the `ALLOWED_ORIGIN` variable and set it to your Vercel URL.
4. Click **Save Changes**. Render will automatically redeploy with the updated CORS permission!

Now your backend and Next.js frontend are securely connected in the cloud and ready to use!
