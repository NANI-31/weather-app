# Deployment Guide

## 🖥️ Frontend Deployment (Vercel)

We use **Vercel** for the React frontend due to its seamless integration with Vite and free tier performance.

### 1. Prerequisites

- Push your `client` folder code to GitHub.
- Create a Vercel account.

### 2. Steps

1.  **Dashboard**: Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
2.  **Import**: Select your GitHub repository.
3.  **Configure Project**:
    - **Framework Preset**: Vite
    - **Root Directory**: Click "Edit" and select the `client` folder.
    - **Build Command**: `npm run build` (Default)
    - **Output Directory**: `dist` (Default)
    - **Install Command**: `npm install` (Default)
4.  **Environment Variables**:
    Add the following variables under the **Environment Variables** section:
    - `VITE_SERVER_URL`: `https://your-backend-render-url.onrender.com` (You will get this after backend deploy)
    - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
    - `VITE_OPENWEATHER_API_KEY`: Your OpenWeatherMap Key
5.  **Deploy**: Click **Deploy**. Vercel will build and host your site.

---

## ⚙️ Backend Deployment (Render)

We use **Render** for the Node.js/Express backend as it supports free web services.

### 1. Prerequisites

- Push your `server` folder code to GitHub.
- Create a Render account.

### 2. Steps

1.  **Dashboard**: Go to [Render Dashboard](https://dashboard.render.com/) and click **"New +" -> "Web Service"**.
2.  **Connect**: Connect your GitHub repository.
3.  **Configure Service**:
    - **Name**: `weather-app-api` (or unique name)
    - **Root Directory**: `server` (Important!)
    - **Environment**: Node
    - **Region**: Closest to you (e.g., Singapore, Oregon)
    - **Branch**: `main`
4.  **Build & Start Commands**:
    - **Build Command**: `npm install && npm run build`
    - **Start Command**: `npm start` (This runs `node dist/index.js`)
5.  **Environment Variables**:
    Add these in the **Environment** tab:
    - `NODE_ENV`: `production`
    - `PORT`: `5000` (Render handles this internally, but good to set)
    - `MONGO_URI`: `mongodb+srv://...` (Your MongoDB Atlas connection string)
    - `JWT_SECRET`: A strong random string for tokens.
    - `CLIENT_URL`: `https://your-frontend-vercel-app.vercel.app` (Exact URL of your frontend)
    - **Cloudinary Keys**: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
    - **Google Keys**: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_REDIRECT_URI` (`https://developers.google.com/oauthplayground` or your redirect)
    - **Email**: `EMAIL_USER` (Gmail address)
6.  **Deploy**: Click **Create Web Service**.

### 3. Post-Deployment (CORS)

Once deployed, copy your **Render Backend URL** (e.g., `https://weather-api.onrender.com`).

1.  Go back to **Vercel** -> Settings -> Environment Variables.
2.  Update `VITE_SERVER_URL` with this new backend URL.
3.  Redeploy Vercel (Frontent) to apply the change.

---

## ✅ Best Practices

- **Never commit `.env` files** to GitHub.
- **Health Check**: Ensure your backend has a root route (`/`) returning "API Running" or similar to quickly verify status.
- **Logs**: Check Render logs if the build fails; it usually indicates a missing type or dependency.
