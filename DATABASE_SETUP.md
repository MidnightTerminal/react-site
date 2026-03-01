# 🗄️ MySQL Database Setup Guide for ShopVibe

This guide explains how to connect your ShopVibe e-commerce frontend to a **MySQL database** so that products, cart, wishlist, and orders are stored and served from the database.

---

## 📋 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Install MySQL](#2-install-mysql)
3. [Create the Database & Tables](#3-create-the-database--tables)
4. [Set Up the Backend API (Node.js + Express)](#4-set-up-the-backend-api)
5. [Install Backend Dependencies](#5-install-backend-dependencies)
6. [Configure Environment Variables](#6-configure-environment-variables)
7. [Run the Backend Server](#7-run-the-backend-server)
8. [Connect the Frontend to the Backend](#8-connect-the-frontend-to-the-backend)
9. [API Endpoints Reference](#9-api-endpoints-reference)
10. [Database Schema Explanation](#10-database-schema-explanation)
11. [Deploying to Production](#11-deploying-to-production)

---

## 1. Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or later) — [Download](https://nodejs.org)
- **MySQL** (v8.0 or later) — [Download](https://dev.mysql.com/downloads/)
- **npm** (comes with Node.js)
- A MySQL client (MySQL Workbench, DBeaver, or command line)

---

## 2. Install MySQL

### On Windows:
```bash
# Download MySQL Installer from https://dev.mysql.com/downloads/installer/
# Run the installer and follow the setup wizard
# Set root password during installation
```

### On macOS:
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

### On Ubuntu/Linux:
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

### Verify Installation:
```bash
mysql --version
# Should output: mysql  Ver 8.0.xx ...
```

---

## 3. Create the Database & Tables

### Option A: Using MySQL Command Line
```bash
# Log in to MySQL
mysql -u root -p

# Run the schema file
source backend/schema.sql
```

### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Open `backend/schema.sql`
4. Click the ⚡ Execute button

### Option C: Copy-Paste
Log in to MySQL and paste the contents of `backend/schema.sql` (included in this project).

The schema creates:
- `shopvibe` database
- `products` table (with all columns for badges, pricing, etc.)
- `categories` table
- `cart_items` table
- `wishlist_items` table
- `orders` and `order_items` tables
- `users` table
- Sample product data pre-inserted

---

## 4. Set Up the Backend API

The backend folder (`backend/`) contains a complete **Node.js + Express** REST API.

### Project Structure:
```
backend/
├── server.js          # Main Express server
├── schema.sql         # Database schema + seed data
├── .env.example       # Environment variables template
├── package.json       # Backend dependencies
├── routes/
│   ├── products.js    # Product CRUD endpoints
│   ├── cart.js        # Cart endpoints
│   ├── wishlist.js    # Wishlist endpoints
│   └── orders.js      # Order/checkout endpoints
└── db.js              # MySQL connection pool
```

---

## 5. Install Backend Dependencies

```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# This installs:
# - express        (web framework)
# - mysql2          (MySQL driver with promises)
# - cors            (cross-origin requests)
# - dotenv          (environment variables)
# - helmet          (security headers)
# - express-rate-limit (rate limiting)
```

---

## 6. Configure Environment Variables

```bash
# Copy the example env file
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=shopvibe

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

⚠️ **IMPORTANT:** Replace `your_mysql_password_here` with your actual MySQL root password.

---

## 7. Run the Backend Server

```bash
cd backend
npm start
```

You should see:
```
✅ Connected to MySQL database: shopvibe
🚀 ShopVibe API server running on http://localhost:5000
```

### Test the API:
```bash
# In a new terminal
curl http://localhost:5000/api/products
```

---

## 8. Connect the Frontend to the Backend

The frontend includes an API service file at `src/services/api.ts`.

### Step 1: Update the API base URL

In `src/services/api.ts`, the base URL is set to:
```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

### Step 2: Replace static data with API calls

In your components, replace the static imports:

**Before (static data):**
```tsx
import { handbagProducts } from '../data/products';

function HandbagsPage() {
  const products = handbagProducts;
  // ...
}
```

**After (from database):**
```tsx
import { productApi } from '../services/api';
import { useState, useEffect } from 'react';

function HandbagsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await productApi.getByCategory('Handbags');
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  // ... render products
}
```

### Step 3: Run both servers

```bash
# Terminal 1 — Backend
cd backend && npm start

# Terminal 2 — Frontend
npm run dev
```

---

## 9. API Endpoints Reference

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/products/:id` | Get single product |
| `GET` | `/api/products/category/:category` | Get products by category |
| `GET` | `/api/products/search?q=keyword` | Search products |
| `POST` | `/api/products` | Create a product (admin) |
| `PUT` | `/api/products/:id` | Update a product (admin) |
| `DELETE` | `/api/products/:id` | Delete a product (admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/cart/:userId` | Get user's cart |
| `POST` | `/api/cart` | Add item to cart |
| `PUT` | `/api/cart/:id` | Update cart item quantity |
| `DELETE` | `/api/cart/:id` | Remove item from cart |
| `DELETE` | `/api/cart/clear/:userId` | Clear entire cart |

### Wishlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/wishlist/:userId` | Get user's wishlist |
| `POST` | `/api/wishlist` | Add to wishlist |
| `DELETE` | `/api/wishlist/:id` | Remove from wishlist |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders/:userId` | Get user's orders |
| `GET` | `/api/orders/detail/:orderId` | Get order details |
| `POST` | `/api/orders` | Create new order (checkout) |
| `PUT` | `/api/orders/:id/status` | Update order status |

---

## 10. Database Schema Explanation

### `products` Table
| Column | Type | Description |
|--------|------|-------------|
| `id` | INT AUTO_INCREMENT | Primary key |
| `name` | VARCHAR(255) | Product name |
| `price` | DECIMAL(10,2) | Current selling price |
| `original_price` | DECIMAL(10,2) NULL | Original price (for discount badge) |
| `category` | VARCHAR(100) | Category: Handbags, Clothing, Sneakers, Gadgets, Kids |
| `badge` | VARCHAR(50) NULL | Manual badge text (Best Seller, Trending, etc.) |
| `badge_color` | VARCHAR(50) NULL | Tailwind badge color class |
| `rating` | DECIMAL(2,1) | Product rating (0.0 - 5.0) |
| `reviews` | INT | Number of reviews |
| `emoji` | VARCHAR(10) | Emoji icon for the product |
| `gradient` | VARCHAR(100) | Tailwind gradient classes |
| `is_new` | BOOLEAN DEFAULT FALSE | Whether product is new (shows "New" badge) |
| `image_url` | VARCHAR(500) NULL | Product image URL |
| `description` | TEXT NULL | Product description |
| `stock` | INT DEFAULT 0 | Inventory count |
| `created_at` | TIMESTAMP | When product was added |
| `updated_at` | TIMESTAMP | When product was last updated |

### Badge Logic (Automatic):
```
IF original_price > price → badge = "X% OFF" (red badge)
ELSE IF is_new = TRUE → badge = "New" (brand color badge)
ELSE → use the manual badge column (Best Seller, Trending, etc.)
```

---

## 11. Deploying to Production

### Option A: Using Railway (easiest)
```bash
# 1. Push your backend to GitHub
# 2. Go to https://railway.app
# 3. Create a new project → Deploy from GitHub
# 4. Add a MySQL plugin
# 5. Railway will auto-set DB_HOST, DB_USER, etc.
# 6. Add environment variable: FRONTEND_URL=https://your-frontend.com
```

### Option B: Using PlanetScale (serverless MySQL)
```bash
# 1. Create account at https://planetscale.com
# 2. Create a database
# 3. Get connection string
# 4. Update backend/.env with PlanetScale credentials
```

### Option C: Using AWS RDS
```bash
# 1. Create an RDS MySQL instance in AWS Console
# 2. Configure security group to allow your server's IP
# 3. Update backend/.env with RDS endpoint
```

### Option D: Using DigitalOcean
```bash
# 1. Create a Managed Database (MySQL)
# 2. Deploy backend as an App or Droplet
# 3. Update .env with connection details
```

### Frontend Deployment:
```bash
# Build the frontend
npm run build

# Deploy dist/ folder to:
# - Vercel (recommended)
# - Netlify
# - GitHub Pages
# - AWS S3 + CloudFront

# Update VITE_API_URL in your deployment env:
# VITE_API_URL=https://your-backend-api.com/api
```

---

## ❓ FAQ

### Q: How do I add a new product via the API?
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Leather Bag",
    "price": 89.99,
    "original_price": 129.99,
    "category": "Handbags",
    "rating": 4.5,
    "reviews": 0,
    "emoji": "👜",
    "gradient": "from-pink-100 to-rose-100",
    "is_new": true,
    "description": "Beautiful new leather handbag",
    "stock": 50
  }'
```

### Q: How do I add product images instead of emojis?
Add the `image_url` to your product in the database, then update the frontend `ProductCard` to show `<img src={product.image_url}>` instead of the emoji.

### Q: Can I use this with a different database (PostgreSQL, MongoDB)?
Yes! Just swap `mysql2` with `pg` (PostgreSQL) or `mongoose` (MongoDB) in the backend. The API endpoints stay the same.

### Q: How do I add authentication?
Add `jsonwebtoken` and `bcryptjs` to the backend. Create login/register endpoints, and use JWT tokens to protect cart/order routes.

---

## 🎉 You're all set!

Your architecture:
```
┌──────────────┐     HTTP/REST     ┌──────────────┐     MySQL     ┌──────────────┐
│   React      │  ←──────────────→ │   Express    │ ←───────────→ │   MySQL      │
│   Frontend   │   localhost:5173  │   Backend    │  localhost:3306│   Database   │
│  (Vite)      │                   │  (Node.js)   │               │  (shopvibe)  │
└──────────────┘                   └──────────────┘               └──────────────┘
```

For questions or issues, check the console logs in both the frontend and backend terminals.
