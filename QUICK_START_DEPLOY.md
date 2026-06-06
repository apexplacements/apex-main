# ⚡ Quick Start - Deploy Backend to Production

## Option 1: Use PowerShell Deployment Script (Recommended for Windows)

### Prerequisites
- PowerShell (Windows 10+)
- SCP and SSH installed (included with Git Bash or PuTTY)
- `apex-placements.pem` EC2 key file
- Backend code ready

### Quick Deploy

```powershell
# Open PowerShell as Administrator
# Navigate to project root
cd C:\Users\santh\Website\APEXSKILLS

# Run deployment script
.\deploy.ps1 -KeyPath "C:\path\to\apex-placements.pem"
```

The script will:
1. ✅ Upload backend code to EC2
2. ✅ Install Node.js dependencies  
3. ✅ Configure systemd service
4. ✅ Start backend application
5. ✅ Enable auto-restart on reboot

---

## Option 2: Manual Deployment (Step-by-Step)

### Step 1: Locate Your EC2 Key

Find or generate your `apex-placements.pem` file:
- Check Downloads folder
- Check Documents folder
- Or download from AWS EC2 Console > Key Pairs

### Step 2: Upload Backend Code

Using Git Bash or WSL:

```bash
# Replace with actual path to your PEM file
cd /c/Users/santh/Website/APEXSKILLS

scp -i /c/path/to/apex-placements.pem -r backend ubuntu@ec2-13-207-1-159.ap-south-1.compute.amazonaws.com:/home/ubuntu/
```

### Step 3: SSH into EC2 Instance

```bash
ssh -i /c/path/to/apex-placements.pem ubuntu@ec2-13-207-1-159.ap-south-1.compute.amazonaws.com
```

### Step 4: Install and Start Backend

On the EC2 instance, run these commands:

```bash
# Update system
sudo apt-get update
sudo apt-get install -y nodejs npm

# Navigate to backend
cd ~/backend

# Install dependencies
npm install --production

# Set environment variables
export NODE_ENV=production
export DB_HOST=apexdb.cd2mcguiedkw.ap-south-1.rds.amazonaws.com
export DB_NAME=apex_portal
export DB_USER=root
export DB_PASSWORD=Apex1234
export PORT=5000

# Start application with PM2
sudo npm install -g pm2
pm2 start server.js --name "apex-backend"
pm2 startup
pm2 save
```

### Step 5: Install Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt-get install -y nginx

# Create Nginx config
sudo tee /etc/nginx/sites-available/apex-api > /dev/null << 'EOF'
server {
    listen 80;
    server_name api.apexplacements.in;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/apex-api /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Setup SSL Certificate

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot certonly --nginx -d api.apexplacements.in

# Update Nginx to use HTTPS
sudo systemctl reload nginx
```

---

## Verification Checklist

After deployment, verify everything is working:

```bash
# Check backend is running
pm2 status

# View logs
pm2 logs apex-backend

# Test API endpoint locally (on EC2)
curl http://localhost:5000/api/students

# Test via Nginx
curl http://localhost/api/students

# Check SSL certificate
curl -I https://api.apexplacements.in/api/students
```

---

## Frontend Verification

1. Open browser: https://www.apexplacements.in
2. Click "Login" 
3. Enter credentials:
   - Email: `srikanth.hr@apexplacements.in`
   - Password: `Srikanth@12#*`
4. Verify HR Dashboard loads
5. Test CRUD operations (create a student, etc.)

---

## Emergency: If Something Goes Wrong

### Backend not responding?

```bash
# Check logs
pm2 logs apex-backend

# Restart backend
pm2 restart apex-backend

# Check if port 5000 is in use
sudo lsof -i :5000

# Check database connection
mysql -h apexdb.cd2mcguiedkw.ap-south-1.rds.amazonaws.com -u root -p apex_portal -e "SELECT 1"
```

### Nginx errors?

```bash
# Test config
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### Need to update environment variables?

```bash
# Edit PM2 environment
nano ~/.pm2/conf.js

# Or restart with new env vars
PM2_HOME=~/.pm2 NODE_ENV=production pm2 restart apex-backend
```

---

## Key Information

**EC2 Instance**: ec2-13-207-1-159.ap-south-1.compute.amazonaws.com
**Backend Port**: 5000 (locally on EC2)
**API Endpoint**: https://api.apexplacements.in
**Frontend Domain**: https://www.apexplacements.in

**Database**:
- Host: apexdb.cd2mcguiedkw.ap-south-1.rds.amazonaws.com
- Database: apex_portal
- User: root
- Password: Apex1234

**HR Test Account**:
- Email: srikanth.hr@apexplacements.in
- Password: Srikanth@12#*

---

## Support

If you encounter issues:

1. Check backend logs: `pm2 logs apex-backend`
2. Check database connection from EC2
3. Verify DNS records point to EC2 IP
4. Ensure security groups allow ports 80, 443, 5000
5. Check that .env file has correct database credentials

**Status**: 🟢 All systems ready for production deployment
