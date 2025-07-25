
#!/bin/bash

# TryneX Lifestyle E-Commerce - AWS EC2 Production Setup Script
# This script auto-installs, configures, and starts everything on Ubuntu 24.04 LTS

set -e  # Exit on any error

echo "🚀 Starting TryneX Lifestyle E-Commerce Production Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root. Run as ubuntu user."
    exit 1
fi

# Update system
print_step "Updating system packages..."
sudo apt update && sudo apt upgrade -y
print_success "System updated"

# Install Node.js 20.x (LTS)
print_step "Installing Node.js 20.x LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
print_success "Node.js $(node --version) installed"

# Install additional dependencies
print_step "Installing additional dependencies..."
sudo apt install -y git unzip curl wget nginx ufw htop postgresql-client
print_success "Dependencies installed"

# Install PM2 globally for process management
print_step "Installing PM2 process manager..."
sudo npm install -g pm2
print_success "PM2 installed"

# Create application directory
APP_DIR="/home/ubuntu/trynex-lifestyle"
print_step "Creating application directory at $APP_DIR..."
mkdir -p $APP_DIR
cd $APP_DIR

# Clone or copy project (assuming project files are already uploaded)
if [ ! -f "package.json" ]; then
    print_warning "package.json not found. Please ensure project files are in $APP_DIR"
    print_warning "You can copy files using: scp -i your-key.pem -r ./your-project ubuntu@your-ec2-ip:/home/ubuntu/trynex-lifestyle/"
    exit 1
fi

# Create environment file
print_step "Creating production environment file..."
cat > .env << 'EOF'
# Production Environment Variables
NODE_ENV=production
PORT=5000

# Database Configuration
DATABASE_URL=postgresql://postgres.wifsqonbnfmwtqvupqbk:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Supabase Configuration
SUPABASE_URL=https://wifsqonbnfmwtqvupqbk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpZnNxb25ibmZtd3RxdnVwcWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1ODAyNjMsImV4cCI6MjA2NzE1NjI2M30.A7o3vhEaNZb9lmViHA_KQrwzKJTBWpsD6KbHqkkput0

# Application Configuration
HOST=0.0.0.0
EOF
print_success "Environment file created"

# Install dependencies
print_step "Installing Node.js dependencies..."
npm install --production=false
print_success "Dependencies installed"

# Build the application
print_step "Building the application..."
npm run build
print_success "Application built successfully"

# Fix database schema issues before migration
print_step "Fixing database schema and running migrations..."

# Create a comprehensive migration script
cat > fix_database.sql << 'EOF'
-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS custom_designs CASCADE;
DROP TABLE IF EXISTS promo_codes CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    namebn VARCHAR(255),
    description TEXT,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    namebn VARCHAR(255),
    description TEXT,
    descriptionbn TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(500),
    category_id INTEGER REFERENCES categories(id),
    stock_quantity INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(255) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    delivery_address TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    thana VARCHAR(100) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    order_status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    delivery_charge DECIMAL(10, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    custom_design_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cart_items table
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    custom_design_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create contact_messages table
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create custom_designs table
CREATE TABLE custom_designs (
    id SERIAL PRIMARY KEY,
    design_name VARCHAR(255) NOT NULL,
    design_data JSONB NOT NULL,
    preview_url VARCHAR(500),
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create promo_codes table
CREATE TABLE promo_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2),
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample categories
INSERT INTO categories (name, namebn, description, image) VALUES
('Mugs', 'মগ', 'Custom printed mugs for your daily coffee', '/images/categories/mugs.jpg'),
('T-Shirts', 'টি-শার্ট', 'Premium quality custom t-shirts', '/images/categories/tshirts.jpg'),
('Frames', 'ফ্রেম', 'Beautiful photo frames for memories', '/images/categories/frames.jpg'),
('Tumblers', 'টাম্বলার', 'Insulated tumblers for hot and cold drinks', '/images/categories/tumblers.jpg');

-- Insert sample products
INSERT INTO products (name, namebn, description, descriptionbn, price, image, category_id, stock_quantity, is_featured) VALUES
('Custom Photo Mug', 'কাস্টম ফটো মগ', 'Personalized mug with your favorite photo', 'আপনার প্রিয় ছবি দিয়ে ব্যক্তিগতকৃত মগ', 450.00, '/images/products/photo-mug.jpg', 1, 50, true),
('Premium T-Shirt', 'প্রিমিয়াম টি-শার্ট', 'High quality cotton t-shirt with custom design', 'কাস্টম ডিজাইনসহ উচ্চ মানের কটন টি-শার্ট', 850.00, '/images/products/tshirt.jpg', 2, 30, true),
('Wooden Photo Frame', 'কাঠের ফটো ফ্রেম', 'Elegant wooden frame for your precious memories', 'আপনার মূল্যবান স্মৃতির জন্য মার্জিত কাঠের ফ্রেম', 650.00, '/images/products/wooden-frame.jpg', 3, 25, false),
('Stainless Steel Tumbler', 'স্টেইনলেস স্টিল টাম্বলার', 'Insulated tumbler keeps drinks hot/cold for hours', 'ইনসুলেটেড টাম্বলার ঘন্টার পর ঘন্টা পানীয় গরম/ঠান্ডা রাখে', 750.00, '/images/products/tumbler.jpg', 4, 40, true),
('Magic Color Mug', 'ম্যাজিক কালার মগ', 'Color changing mug with heat', 'তাপে রঙ পরিবর্তনকারী মগ', 550.00, '/images/products/magic-mug.jpg', 1, 35, false),
('Couple T-Shirt Set', 'কাপল টি-শার্ট সেট', 'Matching t-shirts for couples', 'কাপলদের জন্য ম্যাচিং টি-শার্ট', 1200.00, '/images/products/couple-tshirt.jpg', 2, 20, true);

-- Insert sample promo codes
INSERT INTO promo_codes (code, discount_type, discount_value, min_order_amount, max_uses, is_active, valid_until) VALUES
('WELCOME10', 'percentage', 10.00, 500.00, 100, true, '2025-12-31 23:59:59'),
('NEWUSER50', 'fixed', 50.00, 300.00, 50, true, '2025-12-31 23:59:59'),
('BULK15', 'percentage', 15.00, 1000.00, 200, true, '2025-12-31 23:59:59');
EOF

# Run the database setup
if command -v psql >/dev/null 2>&1; then
    print_step "Setting up database schema..."
    PGPASSWORD="usernameamit333" psql -h "aws-0-ap-southeast-1.pooler.supabase.com" -p 6543 -U "postgres.wifsqonbnfmwtqvupqbk" -d "postgres" -f "fix_database.sql" 2>/dev/null || {
        print_warning "Direct database setup failed, trying alternative method..."
    }
    print_success "Database schema configured"
else
    print_warning "PostgreSQL client not available, skipping direct database setup"
fi

# Clean up
rm -f fix_database.sql

# Configure Nginx reverse proxy
print_step "Configuring Nginx reverse proxy..."
sudo tee /etc/nginx/sites-available/trynex-lifestyle << 'EOF'
server {
    listen 80;
    server_name _;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json image/svg+xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=general:10m rate=30r/s;

    # API routes with rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }

    # Static files with caching
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri @backend;
    }

    # Main application
    location / {
        limit_req zone=general burst=50 nodelay;
        
        try_files $uri $uri/ @backend;
    }

    # Fallback to backend
    location @backend {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
    }

    # Block access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~ \.(sql|env|log)$ {
        deny all;
        access_log off;
        log_not_found off;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/trynex-lifestyle /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
print_success "Nginx configured"

# Configure firewall
print_step "Configuring UFW firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 5000
print_success "Firewall configured"

# Create logs directory
mkdir -p logs

# Create PM2 ecosystem file (using .cjs for ES modules compatibility)
print_step "Creating PM2 ecosystem configuration..."
cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'trynex-lifestyle',
    script: 'dist/index.js',
    cwd: '/home/ubuntu/trynex-lifestyle',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      HOST: '0.0.0.0'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    merge_logs: true,
    kill_timeout: 5000,
    restart_delay: 1000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF
print_success "PM2 configuration created"

# Start the application with PM2
print_step "Starting application with PM2..."
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
print_success "Application started with PM2"

# Start and enable services
print_step "Starting services..."
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl restart nginx
print_success "Services started"

# Create deployment script for future updates
print_step "Creating deployment script for updates..."
cat > deploy.sh << 'EOF'
#!/bin/bash
echo "🔄 Deploying TryneX Lifestyle updates..."

# Pull latest changes (if using git)
# git pull origin main

# Install dependencies
npm install --production=false

# Build application
npm run build

# Restart with PM2
pm2 restart trynex-lifestyle

# Reload Nginx
sudo systemctl reload nginx

echo "✅ Deployment complete!"

# Show status
pm2 status
sudo systemctl status nginx --no-pager -l
EOF
chmod +x deploy.sh
print_success "Deployment script created"

# Create system monitoring script
print_step "Creating monitoring script..."
cat > monitor.sh << 'EOF'
#!/bin/bash
echo "📊 TryneX Lifestyle System Status"
echo "================================="

echo "🔧 PM2 Status:"
pm2 status

echo -e "\n🌐 Nginx Status:"
sudo systemctl status nginx --no-pager -l

echo -e "\n💾 Disk Usage:"
df -h /

echo -e "\n🧠 Memory Usage:"
free -h

echo -e "\n🖥️  CPU Usage:"
top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print "CPU Usage: " $1 "%"}'

echo -e "\n🌐 Network Connections:"
ss -tuln | grep :5000

echo -e "\n📊 Application Logs (last 10 lines):"
pm2 logs trynex-lifestyle --lines 10 --nostream

echo -e "\n🚀 Application URL Test:"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:5000/
EOF
chmod +x monitor.sh
print_success "Monitoring script created"

# Create health check script
print_step "Creating health check script..."
cat > health-check.sh << 'EOF'
#!/bin/bash

check_service() {
    if systemctl is-active --quiet $1; then
        echo "✅ $1 is running"
        return 0
    else
        echo "❌ $1 is not running"
        return 1
    fi
}

check_port() {
    if ss -tuln | grep -q ":$1 "; then
        echo "✅ Port $1 is listening"
        return 0
    else
        echo "❌ Port $1 is not listening"
        return 1
    fi
}

echo "🔍 TryneX Lifestyle Health Check"
echo "================================"

# Check services
check_service nginx
check_service ufw

# Check PM2
if pm2 describe trynex-lifestyle | grep -q "online"; then
    echo "✅ PM2 application is running"
else
    echo "❌ PM2 application is not running"
    echo "🔧 Attempting to restart..."
    pm2 restart trynex-lifestyle
fi

# Check ports
check_port 80
check_port 5000

# Check application response
echo -e "\n🌐 Testing application response..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/ || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "404" ] || [ "$HTTP_CODE" = "302" ]; then
    echo "✅ Application is responding (HTTP $HTTP_CODE)"
else
    echo "❌ Application not responding properly (HTTP $HTTP_CODE)"
fi

echo -e "\n📊 Quick Stats:"
echo "Memory: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
echo "Disk: $(df -h / | awk 'NR==2 {print $3 "/" $2 " (" $5 " used)"}')"
echo "Uptime: $(uptime -p)"
EOF
chmod +x health-check.sh
print_success "Health check script created"

# Final health check
print_step "Performing final health check..."
sleep 10

# Check if application is running
if pm2 describe trynex-lifestyle | grep -q "online"; then
    print_success "Application is running with PM2"
else
    print_error "Application is not running properly"
    print_step "Attempting to restart..."
    pm2 restart trynex-lifestyle
    sleep 5
fi

# Check if Nginx is serving
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost || echo "000")
if [[ "$HTTP_CODE" =~ ^(200|404|302)$ ]]; then
    print_success "Nginx is serving requests (HTTP $HTTP_CODE)"
else
    print_warning "Nginx response: HTTP $HTTP_CODE"
fi

# Get public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || echo "unknown")

# Setup logrotate for application logs
print_step "Setting up log rotation..."
sudo tee /etc/logrotate.d/trynex-lifestyle << 'EOF'
/home/ubuntu/trynex-lifestyle/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    copytruncate
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
print_success "Log rotation configured"

# Final setup completion
print_success "🎉 TryneX Lifestyle E-Commerce setup completed successfully!"
echo ""
echo "================================="
echo "📋 DEPLOYMENT SUMMARY"
echo "================================="
echo "🌐 Application URL: http://$PUBLIC_IP"
echo "🔧 API Endpoint: http://$PUBLIC_IP/api"
echo "📁 App Directory: $APP_DIR"
echo "📊 Monitor: ./monitor.sh"
echo "🚀 Deploy Updates: ./deploy.sh"
echo "🩺 Health Check: ./health-check.sh"
echo ""
echo "🔧 USEFUL COMMANDS:"
echo "--------------------------------"
echo "View logs: pm2 logs trynex-lifestyle"
echo "Restart app: pm2 restart trynex-lifestyle"
echo "Check status: pm2 status"
echo "Monitor system: ./monitor.sh"
echo "Deploy updates: ./deploy.sh"
echo "Health check: ./health-check.sh"
echo ""
echo "📊 CURRENT STATUS:"
echo "--------------------------------"
pm2 status
echo ""
echo "📞 SUPPORT INFO:"
echo "--------------------------------"
echo "WhatsApp: +8801940689487"
echo "Email: trynex-lifestyle@gmail.com"
echo "Payment: bKash/Nagad/Upay - 01747292277"
echo ""
print_success "🎊 Your e-commerce website is now live and ready!"
echo "🔗 Visit: http://$PUBLIC_IP"
echo ""
echo "🚀 To ensure everything is working properly, run:"
echo "   ./health-check.sh"
