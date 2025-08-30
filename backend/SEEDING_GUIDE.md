# 🌱 Database Seeding Guide

This guide explains how to seed your database with sample data including Algerian orders with real names, phone numbers, and Yalidine delivery options.

## 📋 Prerequisites

1. **Database Setup**: Ensure your database is set up and migrations are applied
2. **Environment Variables**: Make sure your `.env` file is configured
3. **Dependencies**: Install all required dependencies

## 🚀 Quick Start

### Option 1: Seed Everything at Once
```bash
npm run db:seed:all
```

This will run both the main seed file and the orders seed file in sequence.

### Option 2: Seed Step by Step

1. **Seed Basic Data** (categories, products, users):
```bash
npm run db:seed
```

2. **Seed Orders** (Algerian orders with Yalidine options):
```bash
npm run db:seed:orders
```

## 📊 What Gets Created

### Main Seed File (`seed-database.js`)
- ✅ Admin user (admin@example.com / admin123)
- ✅ 3 Categories (Electronics, Fashion, Home & Garden)
- ✅ 3 Sample Products (iPhone 15 Pro, Samsung Galaxy S24, Designer Watch)
- ✅ 3 Basic Cities (Algiers, Oran, Constantine)
- ✅ 2 Basic Delivery Desks

### Orders Seed File (`seed-orders.js`)
- ✅ **10 Algerian Cities** with proper wilaya codes
- ✅ **14 Yalidine Delivery Desks** across major cities
- ✅ **50 Sample Orders** with:
  - Real Algerian names (40 first names + 40 last names)
  - Authentic Algerian phone numbers (mobile: 06/05/07, landline: 02x/03x/04x)
  - Random delivery types (Home Delivery / Pickup)
  - Various order statuses (NEW, CONFIRMED, PENDING, CANCELED, etc.)
  - Yalidine tracking numbers for confirmed orders
  - Realistic delivery addresses
  - Random order dates (within last 30 days)

## 🏙️ Algerian Cities Included

| City | Arabic Name | Wilaya Code | Delivery Fee Range |
|------|-------------|-------------|-------------------|
| Algiers | الجزائر | 16 | 200-700 DA |
| Oran | وهران | 31 | 200-700 DA |
| Constantine | قسنطينة | 25 | 200-700 DA |
| Annaba | عنابة | 23 | 200-700 DA |
| Batna | باتنة | 05 | 200-700 DA |
| Blida | البليدة | 09 | 200-700 DA |
| Setif | سطيف | 19 | 200-700 DA |
| Tlemcen | تلمسان | 13 | 200-700 DA |
| Bejaia | بجاية | 06 | 200-700 DA |
| Tebessa | تبسة | 12 | 200-700 DA |

## 🏢 Yalidine Delivery Desks

### Algiers (3 desks)
- Yalidine Algiers Centre
- Yalidine Algiers Bab Ezzouar
- Yalidine Algiers Hussein Dey

### Oran (2 desks)
- Yalidine Oran Centre
- Yalidine Oran Bir El Djir

### Constantine (2 desks)
- Yalidine Constantine Centre
- Yalidine Constantine El Khroub

### Other Cities (1 desk each)
- Annaba, Batna, Blida, Setif, Tlemcen, Bejaia, Tebessa

## 👥 Algerian Names Used

### First Names (40 total)
**Male Names**: Ahmed, Mohammed, Ali, Omar, Youssef, Karim, Samir, Nassim, Bilal, Rachid, Abdelkader, Mustapha, Hassan, Said, Djamel, Farid, Malik, Tarek, Wassim, Adel

**Female Names**: Fatima, Amina, Khadija, Zineb, Meriem, Sara, Nour, Layla, Yasmina, Samira, Nadia, Djamela, Hakima, Fadila, Zakia, Malika, Leila, Rachida, Houria, Yamina

### Last Names (40 total)
Benali, Bouazza, Chaabane, Dahmani, El Amri, Fellah, Guerroumi, Hamidi, Ibrahim, Jaballah, Khelifi, Larbi, Mansouri, Nacer, Ouazani, Pacha, Rahmani, Saadi, Taleb, Ullah, Verdi, Wahab, Yahia, Zerrouki, Abdelkrim, Boumediene, Cherif, Dridi, El Kadi, Fares, Gacem, Hadj, Idir, Jaziri, Kaci, Lounis, Mekki, Nait, Ouali, Poulet

## 📱 Phone Number Format

### Mobile Numbers (30 total)
- **06 series**: 0661234567, 0662345678, etc.
- **05 series**: 0551234567, 0552345678, etc.
- **07 series**: 0771234567, 0772345678, etc.

### Landline Numbers (20 total)
- **02x series**: 021123456, 021234567, etc.
- **03x series**: 031123456, 031234567, etc.
- **04x series**: 041123456, 041234567, etc.
- **05x series**: 051123456, 051234567, etc.

## 📦 Order Details

### Order Structure
- **Order Numbers**: Format `ORD-YYYYMM-XXXX` (e.g., ORD-202412-0001)
- **Items per Order**: 1-3 random products
- **Quantities**: 1-2 per item
- **Delivery Types**: 50% Home Delivery, 50% Pickup
- **Statuses**: Random distribution across all possible statuses

### Order Statuses
- **Call Center Status**: NEW, CONFIRMED, PENDING, CANCELED, DOUBLE_ORDER, DELAYED
- **Delivery Status**: NOT_READY, READY, IN_TRANSIT, DONE

### Yalidine Integration
- **Tracking Numbers**: Format `YLXXXXXXX` for confirmed orders
- **Shipment IDs**: Format `SHXXXXXX` for confirmed orders
- **Delivery Fees**: 200-700 DA based on city

## 🔄 Re-running Seeds

### Safe to Re-run
The seed files use `upsert` operations, so they're safe to run multiple times:
- Existing records will be updated
- New records will be created
- No duplicates will be created

### Reset Database (if needed)
```bash
# Reset database (WARNING: This will delete all data)
npx prisma migrate reset

# Then re-seed
npm run db:seed:all
```

## 🐛 Troubleshooting

### Common Issues

1. **"No categories found"**
   - Run `npm run db:seed` first to create basic data

2. **"No products found"**
   - Run `npm run db:seed` first to create basic data

3. **Database connection errors**
   - Check your `.env` file and database connection
   - Ensure database is running

4. **Prisma errors**
   - Run `npx prisma generate` to regenerate Prisma client
   - Run `npx prisma db push` to sync schema

### Logs
The seed files provide detailed console output showing:
- ✅ Success messages for each created item
- 📊 Summary statistics
- ❌ Error messages if something goes wrong

## 📈 Expected Results

After running `npm run db:seed:all`, you should have:

- **1 Admin User**
- **3 Categories**
- **3 Products**
- **10 Cities**
- **14 Delivery Desks**
- **50 Orders** with realistic Algerian data

The orders will be distributed across different statuses and cities, providing a good sample for testing all dashboard functionalities.

## 🎯 Testing the Data

After seeding, you can:

1. **Login as admin**: admin@example.com / admin123
2. **View orders** in the admin dashboard
3. **Test confirmatrice features** with the sample orders
4. **Test delivery agent features** with confirmed orders
5. **Test Yalidine integration** with tracking numbers

All orders will have realistic Algerian names, phone numbers, and delivery options that match the Yalidine system structure.



