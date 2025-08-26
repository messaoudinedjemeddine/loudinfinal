# E-commerce Backend API

A robust Node.js/Express backend API for the e-commerce platform with PostgreSQL database and Prisma ORM.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Product Management**: CRUD operations for products, categories, and inventory
- **Order Processing**: Complete order management system
- **File Upload**: Image upload functionality for products
- **Admin Dashboard**: Comprehensive admin APIs
- **Security**: Rate limiting, CORS, input validation
- **Database**: PostgreSQL with Prisma ORM

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and other settings
   ```

3. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed initial data
   npm run db:seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Public Endpoints

- `GET /health` - Health check
- `GET /api/products` - Get products with filtering
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured/list` - Get featured products
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user (requires auth)

### Admin Endpoints (requires authentication + admin role)

- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/dashboard/recent-orders` - Recent orders
- `GET /api/admin/dashboard/low-stock` - Low stock products
- `GET /api/admin/orders` - Get all orders
- `PATCH /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/users` - Get all users (super admin only)

### File Upload

- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images
- `DELETE /api/upload/:filename` - Delete uploaded file

## Database Schema

The database includes the following main entities:

- **Users**: Customer and admin accounts
- **Products**: Product catalog with images and sizes
- **Categories**: Product categorization
- **Orders**: Order management with items
- **Cities & Delivery Desks**: Location-based delivery
- **Coupons**: Discount system

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Role-Based Access

- `USER`: Regular customers
- `CALLCENTER`: Call center operators
- `DELIVERY`: Delivery personnel  
- `SUPERADMIN`: Full system access

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional details (in development)"
}
```

## Rate Limiting

- 100 requests per 15 minutes per IP
- Configurable via environment variables

## File Uploads

- Supports image uploads up to 5MB
- Files stored in `/uploads` directory
- Automatic file validation and security checks

## Development

```bash
# Start development server with auto-reload
npm run dev

# View database in Prisma Studio
npm run db:studio

# Run database migrations
npm run db:migrate
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database URL
3. Set secure JWT secret
4. Configure CORS for your frontend domain
5. Set up file storage (local or cloud)
6. Configure reverse proxy (nginx recommended)

## Environment Variables

See `.env.example` for all available configuration options.

## Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation with Zod
- Password hashing with bcrypt
- JWT token expiration
- File upload restrictions