
# 🚀 TryneX Lifestyle E-Commerce Deployment Guide

## Prerequisites
- Replit account with your project
- Supabase project setup with database

## Database Setup (Supabase)

### 1. Database Configuration
Your Supabase database is already configured with:
- **Database URL**: `postgresql://postgres.wifsqonbnfmwtqvupqbk:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpZnNxb25ibmZtd3RxdnVwcWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1ODAyNjMsImV4cCI6MjA2NzE1NjI2M30.A7o3vhEaNZb9lmViHA_KQrwzKJTBWpsD6KbHqkkput0`

### 2. Run Migrations & Seed Data
To set up your database with sample data:
```bash
npm run db:migrate
npm run db:seed
```

The database schema includes:
- ✅ Products table (16+ sample products)
- ✅ Cart items with custom design support
- ✅ Orders with Bengali district/thana system
- ✅ Contact messages
- ✅ Custom designs storage
- ✅ Promo codes management

## Deployment on Replit

### 1. Environment Setup
Your environment variables are already configured in Replit Secrets:
- `DATABASE_URL`: Your Supabase connection string
- `SUPABASE_URL`: https://wifsqonbnfmwtqvupqbk.supabase.co
- `SUPABASE_ANON_KEY`: Your Supabase anon key
- `NODE_ENV`: production

### 2. Build Configuration
The project is configured with:
- **Build Command**: `npm run build` (builds both client and server)
- **Start Command**: `npm start` (runs the production server)
- **Port**: 5000 (automatically forwarded to 80/443)

### 3. Deployment Process
1. Make sure your code is saved and all changes are committed
2. Open the Deployments tab in Replit
3. Choose "Autoscale" deployment type
4. Configure your deployment settings:
   - **Machine Power**: Choose based on your needs (0.25 vCPU recommended)
   - **Max instances**: Set to 1-3 based on expected traffic
5. Click "Deploy"

Your application will be available at your Replit deployment URL.

### 4. Post-Deployment Setup
After deployment:
1. Run database migrations if needed: `npm run db:migrate`
2. Seed the database with sample products: `npm run db:seed`
3. Test all functionality including:
   - Product browsing
   - Cart functionality
   - Checkout process
   - Admin panel access
   - Custom design studio

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

## Replit Deployment Configuration

### Build Settings
```
Build Command: npm run build
Run Command: npm start
Port: 5000 (auto-forwarded)
```

### Environment Variables (Set in Replit Secrets)
```
NODE_ENV=production
DATABASE_URL=your_supabase_connection_string
SUPABASE_URL=https://wifsqonbnfmwtqvupqbk.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### File Structure
```
├── client/           # Frontend React application
├── server/           # Backend Express server
├── shared/           # Shared schemas and types
├── migrations/       # Database migrations
├── dist/             # Built application files
└── netlify.toml      # Deployment configuration
```

## Troubleshooting

### Common Issues
1. **Database Connection**: Ensure DATABASE_URL is correctly set in Secrets
2. **Build Failures**: Check that all dependencies are installed
3. **Port Issues**: Application should listen on 0.0.0.0:5000
4. **Static Files**: Built files are served from dist/ directory

### Debug Commands
```bash
# Check database connection
npm run db:studio

# View build output
npm run build

# Test local server
npm run dev
```

## Post-Deployment Checklist
- [ ] Database migrations run successfully
- [ ] Sample products loaded
- [ ] Frontend loads correctly
- [ ] API endpoints responding
- [ ] Admin panel accessible
- [ ] Custom design studio working
- [ ] Mobile responsiveness tested
- [ ] Payment flow tested
- [ ] Order tracking working

## Performance Optimization

### Autoscale Tips for Replit
- Keep application startup fast
- Use external database (Supabase) for persistence
- Handle errors gracefully without crashing
- Minimize dependencies and use lazy loading
- Clean up temporary files

### Recommended Settings
- **Machine Power**: 0.25-0.5 vCPU for normal traffic
- **Max Instances**: 1-3 based on expected load
- **Scaling**: Automatic based on request volume

🎉 **Your TryneX Lifestyle e-commerce website is now ready for deployment on Replit!**

## Next Steps
1. Click "Deploy" in the Replit Deployments tab
2. Monitor deployment logs for any issues
3. Test all features after deployment
4. Share your deployment URL with customers

Your application will be fully functional with:
- Complete e-commerce functionality
- Bengali language support
- Custom design studio
- Admin panel
- Real-time order tracking
- Mobile-responsive design
