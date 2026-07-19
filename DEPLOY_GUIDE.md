# 🚀 StadiumIQ AI - Production Deployment Guide

This guide provides step-by-step instructions to deploy the StadiumIQ AI platform to production hosting environments.

---

## 🛠️ Phase 1: Firebase & Google Cloud Setup

StadiumIQ AI uses **Firebase Firestore** for database logs, **Firebase Authentication** for user sign-in, and **Google Cloud** for Gemini AI & Maps.

### 1. Firebase Authentication & Firestore Setup:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name it `stadiumiq-ai`.
3. In the left sidebar, navigate to **Build > Authentication** and click **Get Started**.
   - Enable **Email/Password** provider.
   - Enable **Google** sign-in provider.
4. Navigate to **Build > Firestore Database** and click **Create Database**.
   - Select your database location closest to your users.
   - Start in **Production Mode** and update rules as needed.
5. Go to **Project Settings** (cog icon next to Project Overview) and click **Add App** (select Web `</>`).
   - Register your app and copy the `firebaseConfig` credentials JSON.

### 2. Google Cloud APIs:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Google Maps JavaScript API** and copy your Client API Key.
3. Go to the [Google AI Studio Console](https://aistudio.google.com/) and click **Get API key** to generate a production **Gemini API Key**.

---

## 🐍 Phase 2: Deploying the Python FastAPI Backend

We recommend deploying the FastAPI backend to **Render** or **Railway**.

### Option: Deploy to Render (Free Tier Available)
1. Sign up/log in at [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository containing the `StadiumIQ-AI` code.
4. Configure the Web Service settings:
   - **Name**: `stadiumiq-backend`
   - **Environment**: `Python`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
5. Under **Advanced > Environment Variables**, add the following:
   - `GEMINI_API_KEY`: *(Your Gemini API Key)*
   - `FIREBASE_CREDENTIALS_JSON`: *(Optional: Your Firebase service account credentials for production Firestore writes)*
6. Click **Deploy Web Service**. Render will build and provide a public URL (e.g. `https://stadiumiq-backend.onrender.com`).

---

## ⚛️ Phase 3: Deploying the Next.js Frontend

We recommend deploying the Next.js app to **Vercel** (the creators of Next.js).

### Deploy to Vercel
1. Log in or sign up at [Vercel](https://vercel.com/).
2. Click **Add New > Project** and import your GitHub repository.
3. In the project configure settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Select `frontend` (crucial since it is a monorepo).
4. Expand the **Environment Variables** section and add:
   - `NEXT_PUBLIC_API_URL`: Set this to your deployed Render URL (e.g., `https://stadiumiq-backend.onrender.com`).
   - `NEXT_PUBLIC_FIREBASE_API_KEY`: *(From your Firebase web config)*
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: *(From Firebase config)*
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: *(From Firebase config)*
   - `NEXT_PUBLIC_GOOGLE_MAPS_KEY`: *(Your Google Maps JavaScript Client API Key)*
5. Click **Deploy**. Vercel will build the frontend and provide a production URL (e.g. `https://stadiumiq-ai.vercel.app`).

---

## 🔒 Phase 4: CORS Configuration

Ensure your Backend permits requests from your frontend:
1. In `backend/main.py`, update `allow_origins=["*"]` to explicitly target your Vercel production URL for optimal security:
   ```python
   allow_origins=["https://stadiumiq-ai.vercel.app"]
   ```
