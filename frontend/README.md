# E-commerce Platform

A modern, full-stack e-commerce platform built with Next.js frontend and Node.js backend, specifically designed for the Algerian market.

## 🏗️ Architecture

This project is split into two main parts:

- **Frontend** (`/`): Next.js 13+ with React, TypeScript, and Tailwind CSS
- **Backend** (`/backend`): Node.js with Express, Prisma, and PostgreSQL

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API URL
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and other settings
   ```

4. **Database Setup**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Start Backend Server**
   ```bash
   npm run dev
   ```

The backend API will be available at `http://localhost:5000`

## 🛍️ Features

### Customer Features
- **Product Catalog**: Browse products with advanced filtering and search
- **Product Details**: Detailed product pages with image galleries
- **Shopping Cart**: Add/remove items with persistent state
- **Order Placement**: Simple order form without registration required
- **Responsive Design**: Mobile-first design with smooth animations

### Admin Features
- **Dashboard**: Overview of orders, products, and analytics
- **Product Management**: CRUD operations for products and categories
- **Order Management**: Process and track orders
- **User Management**: Manage customer accounts
- **File Upload**: Image management for products

### Technical Features
- **Authentication**: JWT-based auth with role-based access
- **Real-time Updates**: Live cart updates and notifications
- **Internationalization**: Multi-language support (English/Arabic)
- **Security**: Rate limiting, input validation, and secure file uploads
- **Performance**: Optimized images and lazy loading

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **File Upload**: Multer
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate limiting

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── products/          # Product pages
│   └── ...
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...
├── lib/                  # Utility functions and API client
├── backend/              # Backend API
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Express middleware
│   │   ├── config/       # Configuration files
│   │   └── utils/        # Utility functions
│   └── prisma/           # Database schema and migrations
└── ...
```

## 🌍 Algeria-Specific Features

- **Wilaya Selection**: Province-based delivery options
- **Delivery Desks**: Local pickup points
- **Currency**: Algerian Dinar (DA) pricing
- **Phone Validation**: Algerian phone number format
- **Arabic Support**: RTL text and Arabic translations

## 🔐 Authentication & Authorization

The system supports multiple user roles:

- **USER**: Regular customers
- **CALLCENTER**: Call center operators
- **DELIVERY**: Delivery personnel
- **SUPERADMIN**: Full system access

## 📱 API Documentation

The backend provides a comprehensive REST API. Key endpoints:

- `GET /api/products` - Product catalog with filtering
- `POST /api/orders` - Create new order
- `GET /api/categories` - Product categories
- `POST /api/auth/login` - User authentication
- `GET /api/admin/dashboard/stats` - Admin dashboard data

See the backend README for complete API documentation.

## 🚀 Deployment

### Frontend Deployment
The frontend is configured for static export and can be deployed to:
- Vercel (recommended)
- Netlify
- Any static hosting service

### Backend Deployment
The backend can be deployed to:
- Railway
- Heroku
- DigitalOcean
- Any Node.js hosting service

## 🧪 Development

### Running Tests
```bash
# Frontend tests
npm run test

# Backend tests
cd backend && npm run test
```

### Database Management
```bash
cd backend

# View database in Prisma Studio
npm run db:studio

# Create migration
npm run db:migrate

# Reset database
npm run db:reset
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation in each directory
- Review the API documentation in the backend README

---

Built with ❤️ for the Algerian e-commerce market