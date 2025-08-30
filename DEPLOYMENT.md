# 🚀 Deployment Guide: Heroku (Backend) + Vercel (Frontend)

This guide will help you deploy your LOUD Brands e-commerce application to production.

## 📋 Prerequisites

- [Git](https://git-scm.com/) installed
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
- [Vercel CLI](https://vercel.com/docs/cli) installed (optional)
- GitHub account with your repository
- Heroku account
- Vercel account

## 🗄️ Database Setup

### Option 1: Heroku Postgres (Recommended)
1. Create a new Heroku app
2. Add Postgres addon: `heroku addons:create heroku-postgresql:mini`
3. Get your DATABASE_URL: `heroku config:get DATABASE_URL`

### Option 2: External Database
- Use any PostgreSQL provider (Supabase, Railway, etc.)
- Get your DATABASE_URL

## 🔧 Backend Deployment (Heroku)

### Step 1: Prepare Backend
```bash
cd backend
npm install
```

### Step 2: Create Heroku App
```bash
# Login to Heroku
heroku login

# Create new app
heroku create your-loudbrands-backend

# Add Postgres database
heroku addons:create heroku-postgresql:mini
```

### Step 3: Configure Environment Variables
```bash
# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-jwt-key
heroku config:set CORS_ORIGIN=https://your-vercel-app.vercel.app
heroku config:set FRONTEND_URL=https://your-vercel-app.vercel.app

# Set other required variables
heroku config:set YALIDINE_API_ID=your-yalidine-api-id
heroku config:set YALIDINE_API_TOKEN=your-yalidine-api-token
```

### Step 4: Deploy Backend
```bash
# Add Heroku remote
heroku git:remote -a your-loudbrands-backend

# Deploy
git add .
git commit -m "Deploy backend to Heroku"
git push heroku master

# Run database migrations
heroku run npm run build
heroku run npx prisma migrate deploy
heroku run npm run db:seed:all
```

### Step 5: Verify Backend
```bash
# Check logs
heroku logs --tail

# Test the API
curl https://your-loudbrands-backend.herokuapp.com/api/health
```

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend
```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables
Create a `.env.local` file in the frontend directory:
```env
BACKEND_URL=https://your-loudbrands-backend.herokuapp.com
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
```

### Step 3: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add environment variables:
   - `BACKEND_URL`: `https://your-loudbrands-backend.herokuapp.com`
   - `NEXT_PUBLIC_APP_URL`: `https://your-vercel-app.vercel.app`
6. Click "Deploy"

#### Option B: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd frontend
vercel

# Follow the prompts and set environment variables
```

### Step 4: Update Backend CORS
After getting your Vercel URL, update the backend CORS:
```bash
heroku config:set CORS_ORIGIN=https://your-vercel-app.vercel.app
heroku config:set FRONTEND_URL=https://your-vercel-app.vercel.app
```

## 🔄 Continuous Deployment

### Automatic Deployments
- **Vercel**: Automatically deploys on every push to main branch
- **Heroku**: Automatically deploys on every push to master branch

### Manual Deployments
```bash
# Backend
git push heroku master

# Frontend
vercel --prod
```

## 🔍 Troubleshooting

### Common Issues

#### Backend Issues
1. **Database Connection**: Check DATABASE_URL in Heroku config
2. **CORS Errors**: Verify CORS_ORIGIN is set correctly
3. **Build Failures**: Check Heroku logs with `heroku logs --tail`

#### Frontend Issues
1. **API Connection**: Verify BACKEND_URL is correct
2. **Build Errors**: Check Vercel build logs
3. **Image Loading**: Update next.config.js with correct domains

### Useful Commands
```bash
# Check Heroku logs
heroku logs --tail

# Check Heroku config
heroku config

# Restart Heroku app
heroku restart

# Check Vercel deployment
vercel ls
```

## 📊 Monitoring

### Heroku Monitoring
- Use Heroku dashboard to monitor app performance
- Set up logging addons for better debugging

### Vercel Monitoring
- Use Vercel Analytics for performance monitoring
- Check deployment status in Vercel dashboard

## 🔐 Security Checklist

- [ ] JWT_SECRET is set and secure
- [ ] CORS is properly configured
- [ ] Environment variables are not exposed
- [ ] Database is properly secured
- [ ] HTTPS is enabled (automatic on Heroku/Vercel)

## 📞 Support

If you encounter issues:
1. Check the logs: `heroku logs --tail` or Vercel dashboard
2. Verify environment variables
3. Test locally with production environment variables
4. Check the troubleshooting section above

## 🎉 Success!

Once deployed, your application will be available at:
- **Frontend**: `https://your-vercel-app.vercel.app`
- **Backend API**: `https://your-loudbrands-backend.herokuapp.com`

Remember to update the URLs in your configuration files and test all functionality!
