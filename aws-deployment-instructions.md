
# AWS EC2 Deployment Instructions

## Prerequisites
1. AWS Account
2. EC2 instance (Ubuntu 24.04 LTS, t2.micro or larger)
3. Security group allowing ports 22, 80, 443, 5000
4. SSH key pair

## Quick Deployment Steps

### 1. Launch EC2 Instance
- **AMI**: Ubuntu 24.04 LTS
- **Instance Type**: t2.micro (free tier) or t3.micro
- **Security Group**: Allow SSH (22), HTTP (80), HTTPS (443), Custom (5000)

### 2. Connect via SSH
```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### 3. Upload Project Files
```bash
# From your local machine
scp -i your-key.pem -r . ubuntu@your-ec2-public-ip:/home/ubuntu/trynex-lifestyle/
```

### 4. Run Setup Script
```bash
# On EC2 instance
cd /home/ubuntu/trynex-lifestyle
chmod +x setup.sh
./setup.sh
```

## What the Setup Script Does

✅ **System Setup**
- Updates Ubuntu packages
- Installs Node.js 20.x LTS
- Installs Git, Nginx, UFW, PM2

✅ **Application Setup**
- Creates production environment variables
- Installs Node.js dependencies
- Builds the application
- Runs database migrations and seeding

✅ **Production Configuration**
- Configures Nginx reverse proxy
- Sets up PM2 process manager
- Configures UFW firewall
- Creates monitoring and deployment scripts

✅ **Security & Performance**
- HTTPS-ready Nginx configuration
- Security headers
- Gzip compression
- Process monitoring with PM2

## Post-Deployment Management

### Monitor Application
```bash
./monitor.sh  # System status and logs
pm2 status    # PM2 process status
pm2 logs      # View application logs
```

### Deploy Updates
```bash
./deploy.sh   # Automated deployment script
```

### Manual Operations
```bash
# Restart application
pm2 restart trynex-lifestyle

# View logs
pm2 logs trynex-lifestyle

# Restart Nginx
sudo systemctl restart nginx

# Check firewall status
sudo ufw status
```

## Access Your Application
- **Main Site**: `http://your-ec2-public-ip`
- **API**: `http://your-ec2-public-ip/api`
- **Admin Panel**: `http://your-ec2-public-ip/admin`

## Environment Variables (Configured Automatically)
- `NODE_ENV=production`
- `PORT=5000`
- `DATABASE_URL` - Supabase connection
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key

## Cost Estimation
- **t2.micro**: ~$8.5/month (free tier eligible)
- **t3.micro**: ~$10/month
- **Data transfer**: ~$0.09/GB outbound

## Support Information
- **WhatsApp**: +8801940689487
- **Email**: trynex-lifestyle@gmail.com
- **Payment**: bKash/Nagad/Upay - 01747292277
