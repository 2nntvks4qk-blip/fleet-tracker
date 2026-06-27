# Fleet Tracker

Family vehicle maintenance tracker — React + Vite + Supabase, deployed on Vercel.

---

## Setup — step by step

### 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New project**, give it a name (e.g. `fleet-tracker`), pick the closest region
3. Wait ~2 minutes for the project to provision
4. Go to **SQL Editor** in the left sidebar → **New query**
5. Paste the contents of `supabase-schema.sql` and click **Run**
6. Go to **Project Settings → API**
7. Copy your **Project URL** and **Publishable** (anon) key

---

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-key-here
VITE_PASSWORD=yourfamilypassword
```

---

### 3. Run locally

```bash
npm install
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

---

### 4. Deploy to Vercel

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/fleet-tracker.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com), sign in with GitHub
3. Click **Add New → Project** and import your repo
4. Under **Environment Variables**, add all three from your `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_PASSWORD`
5. Click **Deploy**

---

## Changing the password

Update `VITE_PASSWORD` in Vercel project settings → Environment Variables, then redeploy.

## Customizing service intervals

Edit the `INTERVALS` array in `src/components/VehicleCard.jsx`.

## Adding more service types

Edit the `SERVICE_TYPES` array in `src/components/ServiceForm.jsx`.

---

## Project structure

```
src/
  lib/supabase.js          # Supabase client + password auth
  components/
    VehicleCard.jsx        # Vehicle summary card + reminder logic
    VehicleForm.jsx        # Add/edit vehicle form
    ServiceForm.jsx        # Log service form
  pages/
    Login.jsx              # Password gate
    Vehicles.jsx           # Vehicles tab
    ServiceLog.jsx         # Service log tab
    Reminders.jsx          # Reminders tab
  App.jsx                  # Root, data fetching, tab routing
  index.css                # All styles
index.html                 # Vite entry point
vite.config.js             # Vite config
supabase-schema.sql        # Run once in Supabase SQL editor
```
