#!/bin/bash

# Apex Skills HR Portal - Backend Deployment Script
# This script deploys the Node.js backend to the EC2 instance

set -e  # Exit on error

echo "======================================"
echo "Starting Backend Deployment to EC2"
echo "======================================"

# Update system
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js if not already installed
echo "Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 for process management
echo "Installing PM2..."
sudo npm install -g pm2

# Create application directory
echo "Creating application directory..."
sudo mkdir -p /home/ubuntu/apex-hr-portal
sudo chown ubuntu:ubuntu /home/ubuntu/apex-hr-portal
cd /home/ubuntu/apex-hr-portal

# Extract backend code (assuming it's already uploaded)
echo "Setting up backend files..."
# The backend code should be in /home/ubuntu/apex-backend or uploaded via SCP

# Install dependencies
echo "Installing Node.js dependencies..."
cd /home/ubuntu/apex-hr-portal
npm install

# Create .env file with production settings
echo "Creating production .env file..."
cat > .env << 'EOF'
# Database Configuration
DB_HOST=apexdb.cd2mcguiedkw.ap-south-1.rds.amazonaws.com
DB_NAME=apex_portal
DB_USER=root
DB_PASSWORD=Apex1234

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration
CORS_ORIGIN=https://www.apexplacements.in,https://apexplacements.in

# Email Configuration
EMAIL_USER=santhoshreddy9533@gmail.com
EMAIL_PASSWORD=piyh qnhe rqot xrwy

# AWS S3 Configuration
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=www.apexplacements.in
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
EOF

# Start application with PM2
echo "Starting application with PM2..."
pm2 start server.js --name "apex-hr-backend" --max-memory-restart 500M
pm2 startup
pm2 save

# Configure Nginx reverse proxy
echo "Configuring Nginx..."
sudo apt-get install -y nginx

sudo tee /etc/nginx/sites-available/apex-api > /dev/null << 'EOF'
server {
    listen 80;
    server_name api.apexplacements.in;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name api.apexplacements.in;

    ssl_certificate /etc/letsencrypt/live/api.apexplacements.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.apexplacements.in/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/apex-api /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Install Certbot for SSL (if not already installed)
echo "Setting up SSL certificates..."
sudo apt-get install -y certbot python3-certbot-nginx

# Request SSL certificate (interactive)
sudo certbot certonly --nginx -d api.apexplacements.in

# Update Nginx with SSL
sudo systemctl restart nginx

echo "======================================"
echo "Deployment Complete!"
echo "======================================"
echo ""
echo "Backend is now running on: https://api.apexplacements.in"
echo "PM2 Status:"
pm2 status
echo ""
echo "To view logs:"
echo "  pm2 logs apex-hr-backend"
echo ""
echo "To restart application:"
echo "  pm2 restart apex-hr-backend"
