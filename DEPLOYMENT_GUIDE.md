# 🚀 TryneX Lifestyle E-Commerce Deployment Guide

## Prerequisites
- GitHub account
- Netlify account
- Render account  
- Supabase project setup

## Database Setup (Supabase)

### 1. Database Configuration
Your Supabase database is already configured with:
- **Database URL**: `postgresql://postgres.wifsqonbnfmwtqvupqbk:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpZnNxb25ibmZtd3RxdnVwcWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1ODAyNjMsImV4cCI6MjA2NzE1NjI2M30.A7o3vhEaNZb9lmViHA_KQrwzKJTBWpsD6KbHqkkput0`

### 2. Run Migrations
The database schema includes:
- ✅ Products table (16+ sample products)
- ✅ Cart items with custom design support
- ✅ Orders with Bengali district/thana system
- ✅ Contact messages
- ✅ Custom designs storage
- ✅ Promo codes management

## Backend Deployment (Render)

### 1. Connect GitHub Repository
1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Web Service"
4. Connect your GitHub repository

### 2. Configure Render Settings
```
Name: trynex-gift-v3
Environment: Node
Build Command: npm install
Start Command: npm start
```

### 3. Environment Variables
Set these in Render dashboard:
```
NODE_ENV=production
DATABASE_URL=postgresql://postgres.wifsqonbnfmwtqvupqbk:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
SUPABASE_URL=https://wifsqonbnfmwtqvupqbk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpZnNxb25ibmZtd3RxdnVwcWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1ODAyNjMsImV4cCI6MjA2NzE1NjI2M30.A7o3vhEaNZb9lmViHA_KQrwzKJTBWpsD6KbHqkkput0
PORT=5000
```

### 4. Deploy
Click "Create Web Service" - Your backend will be available at:
**https://trynex-gift-v3.onrender.com**

## Frontend Deployment (Netlify)

### 1. Build Configuration
Create `netlify.toml` in root:
```toml
[build]
  command = "npm run build"
  publish = "client/dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_API_URL = "https://trynex-gift-v3.onrender.com"
  VITE_SUPABASE_URL = "https://wifsqonbnfmwtqvupqbk.supabase.co"
  VITE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpZnNxb25ibmZtd3RxdnVwcWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1ODAyNjMsImV4cCI6MjA2NzE1NjI2M30.A7o3vhEaNZb9lmViHA_KQrwzKJTBWpsD6KbHqkkput0"
```

### 2. Deploy to Netlify
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "Add new site" → "Import from Git"
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `client/dist`

Your frontend will be available at:
**https://trynex-gift-v3.netlify.app**

## Features Implemented ✅

### Core E-Commerce Features
- 🛍️ **Product Catalog** - 16+ sample products with Bengali names
- 🛒 **Shopping Cart** - Real-time cart with quantity management
- 📱 **Responsive Design** - Works perfectly on mobile/desktop
- 💳 **Checkout System** - District/Thana delivery, Mobile payment (bKash/Nagad/Upay)
- 🔍 **Order Tracking** - Real-time order status with unique IDs
- 📞 **Contact System** - WhatsApp: +8801940689487, Email: trynex-lifestyle@gmail.com

### Custom Design Studio
- 🎨 **Canvas Editor** - Fully responsive with product mockups
- 📱 **Mobile Optimized** - Dynamic canvas sizing for all devices
- 🖼️ **Product Mockups** - Realistic mug, tumbler, t-shirt, frame previews
- ✍️ **Text & Image Tools** - Add custom text and upload images
- 💾 **Save & Cart** - Save designs and add custom products to cart
- 📥 **Download Preview** - Export design previews

### Admin Panel
- 📊 **Dashboard** - Order management, product management
- 💰 **Revenue Tracking** - Real-time sales analytics
- 📦 **Order Management** - Update order status, view details
- 🎯 **Promo Management** - Create and manage discount codes

### Bengali Support
- 🇧🇩 **Full Bengali** - Product names, descriptions, UI elements
- 📍 **Local Delivery** - Bangladesh district/thana system
- 💱 **Bengali Numerals** - Prices in Bengali script
- 📱 **Mobile Payments** - bKash: 01747292277

## Payment Integration
- **Mobile Wallets**: bKash, Nagad, Upay
- **Payment Number**: 01747292277
- **Confirmation**: 100 TK advance payment required
- **Order Tracking**: Unique ID generated after payment

## Database Schema
All tables created with proper relationships:
- Products (16+ items)
- Cart items with custom design support
- Orders with Bengali address system
- Contact messages
- Custom designs storage
- Promo codes

## Support Information
- **WhatsApp**: +8801940689487
- **Email**: trynex-lifestyle@gmail.com
- **Payment**: bKash/Nagad/Upay - 01747292277

## Post-Deployment Checklist
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Netlify
- [ ] Database migrations run
- [ ] Sample products loaded
- [ ] Admin panel accessible
- [ ] Custom design studio working
- [ ] Mobile responsiveness tested
- [ ] Payment flow tested
- [ ] Order tracking working

## Deployment URLs
- **Frontend**: https://trynex-gift-v3.netlify.app
- **Backend**: https://trynex-gift-v3.onrender.com
- **Database**: Supabase (configured)
- **Repository**: GitHub (ready for push)

🎉 **Your TryneX Lifestyle e-commerce website is now fully functional and ready for deployment!**