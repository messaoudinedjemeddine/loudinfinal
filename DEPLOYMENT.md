# 🚀 Production Deployment Guide

This guide will help you deploy your Loudin e-commerce platform to production.

## 📋 Prerequisites

- **Domain name** (optional but recommended)
- **GitHub account** with your repository
- **Database hosting** (PostgreSQL)
- **Backend hosting** (Railway, Heroku, DigitalOcean, etc.)
- **Frontend hosting** (Vercel, Netlify, etc.)
- **Yalidine API credentials**

## 🗄️ Database Setup

### Option 1: Railway (Recommended)
1. Go to [Railway](https://railway.app)
2. Create a new project
3. Add a PostgreSQL database
4. Copy the database URL
5. Set up automatic deployments

### Option 2: Supabase
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string

### Option 3: AWS RDS
1. Create a PostgreSQL RDS instance
2. Configure security groups
3. Get the connection endpoint

## 🔧 Backend Deployment

### Railway (Recommended)

1. **Connect your repository**
   ```bash
   # In Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your loudinfinal repository
   ```

2. **Set environment variables**
   ```env
   DATABASE_URL="your-postgresql-connection-string"
   JWT_SECRET="your-super-secret-jwt-key-change-this"
   JWT_EXPIRES_IN="7d"
   ADMIN_EMAIL="admin@yourdomain.com"
   ADMIN_PASSWORD="secure-admin-password"
   FRONTEND_URL="https://your-frontend-domain.com"
   YALIDINE_API_ID="your-yalidine-api-id"
   YALIDINE_API_TOKEN="your-yalidine-api-token"
   NODE_ENV="production"
   PORT="5000"
   ```

3. **Configure build settings**
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm start`
   - Root Directory: `backend`

4. **Run database migrations**
   ```bash
   # In Railway terminal or via CLI
   npx prisma migrate deploy
   npm run db:seed
   ```

### Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

3. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET="your-secret"
   heroku config:set YALIDINE_API_ID="your-api-id"
   heroku config:set YALIDINE_API_TOKEN="your-api-token"
   # ... set all other variables
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

## 🌐 Frontend Deployment

### Vercel (Recommended)

1. **Connect your repository**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `frontend`

2. **Set environment variables**
   ```env
   NEXT_PUBLIC_API_URL="https://your-backend-domain.com/api"
   ```

3. **Configure build settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Deploy**
   - Vercel will automatically deploy on push to main branch

### Netlify

1. **Connect your repository**
   - Go to [Netlify](https://netlify.com)
   - Import your GitHub repository
   - Set base directory to `frontend`

2. **Set build settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Set environment variables**
   - Go to Site settings > Environment variables
   - Add `NEXT_PUBLIC_API_URL`

## 🔐 Environment Variables Checklist

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Admin
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="secure-password"

# CORS
FRONTEND_URL="https://your-frontend-domain.com"

# Yalidine Shipping
YALIDINE_API_ID="your-api-id"
YALIDINE_API_TOKEN="your-api-token"

# Production
NODE_ENV="production"
PORT="5000"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="https://your-backend-domain.com/api"
```

## 🗄️ Database Migration

After setting up your production database:

1. **Run migrations**
   ```bash
   npx prisma migrate deploy
   ```

2. **Seed the database**
   ```bash
   npm run db:seed
   ```

3. **Verify setup**
   ```bash
   npx prisma studio
   ```

## 🔍 Post-Deployment Checklist

### Backend Verification
- [ ] API endpoints respond correctly
- [ ] Database connections work
- [ ] Yalidine API integration works
- [ ] File uploads work
- [ ] Authentication works
- [ ] Admin panel accessible

### Frontend Verification
- [ ] Website loads correctly
- [ ] API calls work
- [ ] Images load properly
- [ ] Checkout process works
- [ ] Admin panel accessible
- [ ] PWA features work

### Security Checklist
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] JWT secrets are strong
- [ ] Database credentials secured

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Verify database is accessible
   - Check firewall settings

2. **CORS Errors**
   - Verify FRONTEND_URL in backend
   - Check CORS configuration
   - Ensure HTTPS/HTTP consistency

3. **Yalidine API Errors**
   - Verify API credentials
   - Check rate limits
   - Test API endpoints

4. **Build Failures**
   - Check Node.js version
   - Verify all dependencies
   - Check build logs

### Debug Commands

```bash
# Check backend logs
heroku logs --tail  # Heroku
railway logs        # Railway

# Check database
npx prisma studio

# Test API endpoints
curl https://your-backend-domain.com/api/health
```

## 📊 Monitoring

### Recommended Tools
- **Uptime Robot** - Monitor website availability
- **Sentry** - Error tracking
- **Google Analytics** - User analytics
- **Railway/Heroku Dashboard** - Performance monitoring

### Health Check Endpoint
Add this to your backend for monitoring:

```javascript
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## 🔄 Continuous Deployment

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          # Add your deployment commands
```

## 📞 Support

If you encounter issues:
1. Check the logs in your hosting platform
2. Verify all environment variables
3. Test locally with production settings
4. Check the troubleshooting section above

---

**Happy deploying! 🚀**
