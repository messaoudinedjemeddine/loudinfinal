# 🛍️ Loudin - E-commerce Platform

A modern, full-stack e-commerce platform built with Next.js, Express.js, and PostgreSQL, featuring Yalidine shipping integration for Algeria.

## 🚀 Features

- **Modern E-commerce**: Complete shopping experience with cart, checkout, and order management
- **Yalidine Integration**: Real-time shipping calculations and delivery tracking for Algeria
- **Admin Dashboard**: Comprehensive admin panel with analytics and order management
- **PWA Support**: Progressive Web App with offline capabilities
- **Multi-language**: RTL/LTR support with Arabic and English
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Secure Authentication**: JWT-based authentication system
- **Image Management**: Product image upload and management
- **Order Tracking**: Real-time order status tracking

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Lucide React** - Icon library

### Backend
- **Express.js** - Node.js web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Multer** - File upload handling
- **Zod** - Schema validation

### External Services
- **Yalidine API** - Shipping and delivery services
- **Cloudinary** - Image hosting (optional)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/messaoudinedjemeddine/loudinfinal.git
   cd loudinfinal
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   
   **Backend** (`backend/.env`):
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   ADMIN_EMAIL="admin@example.com"
   ADMIN_PASSWORD="admin123"
   FRONTEND_URL="http://localhost:3000"
   YALIDINE_API_ID="your-yalidine-api-id"
   YALIDINE_API_TOKEN="your-yalidine-api-token"
   ```
   
   **Frontend** (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000/api"
   ```

4. **Set up the database**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start the development servers**
   ```bash
   # Start backend (in backend directory)
   npm run dev
   
   # Start frontend (in frontend directory)
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Admin Panel: http://localhost:3000/admin

## 🔧 Configuration

### Yalidine Shipping Setup
1. Get your API credentials from [Yalidine Developer Dashboard](https://yalidine.app)
2. Add your credentials to `backend/.env`
3. Test the integration using the provided setup guide

### Database Setup
1. Create a PostgreSQL database
2. Update the `DATABASE_URL` in `backend/.env`
3. Run migrations: `npx prisma migrate dev`
4. Seed the database: `npx prisma db seed`

## 📁 Project Structure

```
loudinfinal/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utilities and API clients
│   └── public/              # Static assets
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   └── utils/           # Utility functions
│   ├── prisma/              # Database schema and migrations
│   └── uploads/             # File uploads
├── SETUP.md                 # Detailed setup instructions
├── YALIDINE_SETUP.md        # Yalidine integration guide
└── README.md               # This file
```

## 🚀 Deployment

### Backend Deployment
1. Set up a PostgreSQL database (e.g., on Railway, Supabase, or AWS RDS)
2. Deploy to your preferred platform (Railway, Heroku, DigitalOcean, etc.)
3. Set environment variables in your deployment platform
4. Run database migrations

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Set environment variables for production API URL

## 📚 Documentation

- [Setup Guide](SETUP.md) - Detailed setup instructions
- [Yalidine Integration](YALIDINE_SETUP.md) - Shipping API setup
- [Project Summary](PROJECT_SUMMARY.md) - Feature overview

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation in the `/docs` folder
- Review the setup guides

---

**Built with ❤️ for the Algerian e-commerce community**
