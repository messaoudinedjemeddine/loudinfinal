# 🚀 E-commerce Platform Setup Guide

This guide will help you set up the complete e-commerce platform on your local machine.

## 📋 Prerequisites

Before starting, make sure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **PostgreSQL 12+** - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)
- **npm** or **yarn** package manager

## 🗄️ Database Setup

### 1. Install PostgreSQL
- Download and install PostgreSQL from the official website
- During installation, note down the password you set for the `postgres` user
- Make sure PostgreSQL service is running

### 2. Create Database
```bash
# Connect to PostgreSQL as postgres user
psql -U postgres

# Create the database
CREATE DATABASE ecommerce_db;

# Exit psql
\q
```

## 🔧 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your database credentials
# Replace the DATABASE_URL with your actual PostgreSQL connection string
```

**Example DATABASE_URL format:**
```
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/ecommerce_db"
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push the schema to your database
npm run db:push

# Seed the database with initial data
npm run db:seed
```

### 5. Start Backend Server
```bash
npm run dev
```

The backend API will be running at `http://localhost:5000`

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Copy the example environment file
cp env.example .env.local

# Edit .env.local if you need to change the API URL
# Default is http://localhost:5000/api
```

### 4. Start Frontend Development Server
```bash
npm run dev
```

The frontend will be running at `http://localhost:3000`

## 🔐 Default Admin Credentials

After running the seed script, you can log in to the admin panel with:

- **Email**: admin@example.com
- **Password**: admin123

**⚠️ Important**: Change these credentials in production!

## 📱 Accessing the Application

### Customer Frontend
- **URL**: http://localhost:3000
- **Features**: Browse products, add to cart, place orders

### Admin Dashboard
- **URL**: http://localhost:3000/admin
- **Login**: Use the admin credentials above
- **Features**: Manage products, orders, users, and view analytics

## 🛠️ Development Commands

### Backend Commands
```bash
cd backend

# Start development server
npm run dev

# View database in Prisma Studio
npm run db:studio

# Run database migrations
npm run db:migrate

# Seed database
npm run db:seed
```

### Frontend Commands
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🗂️ Project Structure

```
project/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Express middleware
│   │   ├── config/         # Configuration files
│   │   └── utils/          # Utility functions
│   ├── prisma/             # Database schema
│   └── uploads/            # File uploads directory
├── frontend/               # Next.js application
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── lib/              # Utility functions
│   └── public/           # Static assets
└── SETUP.md              # This file
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env file
   - Ensure database exists

2. **Port Already in Use**
   - Backend: Change PORT in .env file
   - Frontend: Use `npm run dev -- -p 3001`

3. **Module Not Found Errors**
   - Run `npm install` in both directories
   - Clear node_modules and reinstall if needed

4. **Prisma Errors**
   - Run `npm run db:generate` after schema changes
   - Check database connection

### Getting Help

- Check the console for error messages
- Verify all environment variables are set correctly
- Ensure all dependencies are installed
- Check that both servers are running

## 🚀 Next Steps

After successful setup:

1. **Explore the Admin Dashboard** - Add products, categories, and manage orders
2. **Test the Customer Experience** - Browse products and place test orders
3. **Customize the Design** - Modify components in the frontend
4. **Add Features** - Extend the API and frontend as needed
5. **Deploy** - Prepare for production deployment

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Happy coding! 🎉** 