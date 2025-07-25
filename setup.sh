
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
sudo apt install -y git unzip curl wget nginx ufw htop
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

# Test database connection
print_step "Testing database connection..."
if npm run db:migrate; then
    print_success "Database connection successful"
else
    print_warning "Database migration failed - continuing anyway"
fi

# Seed database with sample data
print_step "Seeding database with sample data..."
if npm run db:seed; then
    print_success "Database seeded successfully"
else
    print_warning "Database seeding failed - continuing anyway"
fi

# Configure Nginx reverse proxy
print_step "Configuring Nginx reverse proxy..."
sudo tee /etc/nginx/sites-available/trynex-lifestyle << 'EOF'
server {
    listen 80;
    server_name _;

    # Static files
    location / {
        try_files $uri $uri/ @backend;
    }

    # API routes
    location /api/ {
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
    }

    # Fallback to backend for SPA routing
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
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
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

# Create PM2 ecosystem file
print_step "Creating PM2 ecosystem configuration..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'trynex-lifestyle',
    script: 'dist/server/index.js',
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
    time: true
  }]
};
EOF

# Create logs directory
mkdir -p logs
print_success "PM2 configuration created"

# Start the application with PM2
print_step "Starting application with PM2..."
pm2 start ecosystem.config.js
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
EOF
chmod +x monitor.sh
print_success "Monitoring script created"

# Final health check
print_step "Performing final health check..."
sleep 5

# Check if application is running
if pm2 describe trynex-lifestyle | grep -q "online"; then
    print_success "Application is running"
else
    print_error "Application is not running properly"
fi

# Check if Nginx is serving
if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200\|404\|302"; then
    print_success "Nginx is serving requests"
else
    print_warning "Nginx might not be configured correctly"
fi

# Get public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

print_success "🎉 TryneX Lifestyle E-Commerce setup completed!"
echo ""
echo "================================="
echo "📋 DEPLOYMENT SUMMARY"
echo "================================="
echo "🌐 Application URL: http://$PUBLIC_IP"
echo "🔧 API Endpoint: http://$PUBLIC_IP/api"
echo "📁 App Directory: $APP_DIR"
echo "📊 Monitor: ./monitor.sh"
echo "🚀 Deploy Updates: ./deploy.sh"
echo ""
echo "🔧 USEFUL COMMANDS:"
echo "--------------------------------"
echo "View logs: pm2 logs trynex-lifestyle"
echo "Restart app: pm2 restart trynex-lifestyle"
echo "Check status: pm2 status"
echo "Monitor system: ./monitor.sh"
echo "Deploy updates: ./deploy.sh"
echo ""
echo "📞 SUPPORT INFO:"
echo "--------------------------------"
echo "WhatsApp: +8801940689487"
echo "Email: trynex-lifestyle@gmail.com"
echo "Payment: bKash/Nagad/Upay - 01747292277"
echo ""
print_success "🎊 Your e-commerce website is now live!"
echo "🔗 Visit: http://$PUBLIC_IP"
