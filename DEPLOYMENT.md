# Deployment Guide

## Backend Deployment on Render

### Settings

**Build Command:**

```bash
cd right-fit-matcher-backend && npm ci
```

**Start Command:**

```bash
cd right-fit-matcher-backend && npm start
```

### Environment Variables

Add these in Render's dashboard:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
PORT=4000
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
```

### Database Setup

After deployment, you need to sync the database:

1. **Via Render Dashboard:**

   - Go to your service → Shell
   - Run: `cd right-fit-matcher-backend && npm run sync-db && npm run seed`

2. **Or via SSH:**
   - Connect to your Render instance
   - Run the sync and seed commands

### Important Notes

- The database tables will be created automatically on first start
- Make sure to run `npm run seed` to add sample university data
- The `DATABASE_URL` is automatically provided by Render if you use their PostgreSQL service

## Frontend Deployment on Vercel

### Settings

**Build Command:**

```bash
cd right-fit-matcher-frontend && npm ci && npm run build
```

**Output Directory:**

```bash
right-fit-matcher-frontend/.next
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

## Alternative: Deploy Both on Render

### Backend

- Use the settings above

### Frontend

- Root Directory: `right-fit-matcher-frontend`
- Build Command: `npm ci && npm run build`
- Start Command: `npm start`
- Publish Directory: `.next`
- Environment Variables: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`

## Health Check

- Backend: `https://your-backend.onrender.com/health`
- API Docs: `https://your-backend.onrender.com/api-docs`
