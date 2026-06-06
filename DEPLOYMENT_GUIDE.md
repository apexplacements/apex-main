# 🚀 Production Backend Deployment Guide

## Prerequisites
- EC2 instance running Ubuntu 20.04 or later
- SSH key pair (`apex-placements.pem`)
- Backend code ready to deploy
- AWS RDS database configured and accessible

## Deployment Steps

### Step 1: Prepare Backend Code for Upload

The backend directory structure should be:
```
backend/
├── server.js
├── package.json
├── config/
├── routes/
├── middleware/
├── scripts/
└── uploads/
```

### Step 2: Upload Backend Code to EC2

Using SCP (Secure Copy):

```bash
# From your local machine, navigate to the project root
cd C:\Users\santh\Website\APEXSKILLS

# Upload backend directory to EC2
scp -i "path\to\apex-placements.pem" -r backend ubuntu@ec2-13-207-1-159.ap-south-1.compute.amazonaws.com:/home/ubuntu/apex-backend

# Upload the deployment script
scp -i "path\to\apex-placements.pem" deploy.sh ubuntu@ec2-13-207-1-159.ap-south-1.compute.amazonaws.com:/home/ubuntu/deploy.sh
```

### Step 3: SSH into EC2 Instance

```bash
ssh -i "path\to\apex-placements.pem" ubuntu@ec2-13-207-1-159.ap-south-1.compute.amazonaws.com
```

### Step 4: Run Deployment Script

Once connected to the EC2 instance:

```bash
# Make script executable
chmod +x ~/deploy.sh

# Run the deployment script
~/deploy.sh
```

The script will:
- Update system packages
- Install Node.js and npm
- Install PM2 for process management
- Install and configure Nginx
- Set up SSL certificates with Certbot
- Start the backend application

### Step 5: Configure Environment Variables

The deployment script creates a `.env` file at `/home/ubuntu/apex-hr-portal/.env`. 

Update with your actual credentials:

```bash
# SSH into EC2
ssh -i apex-placements.pem ubuntu@ec2-13-207-1-159.ap-south-1.compute.amazonaws.com

# Edit the .env file
nano /home/ubuntu/apex-hr-portal/.env
```

Ensure these values are correct:
- `DB_HOST`: AWS RDS endpoint
- `DB_NAME`: Database name (apex_portal)
- `DB_USER`: Database user (root)
- `DB_PASSWORD`: Database password
- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key

### Step 6: Verify Deployment

Check if the backend is running:

```bash
# View PM2 status
pm2 status

# View logs
pm2 logs apex-hr-backend

# Test the API
curl https://api.apexplacements.in/api/students
```

### Step 7: Configure DNS

Update your DNS records to point `api.apexplacements.in` to the EC2 instance:

```
Type: A Record
Name: api
Value: 13.207.1.159 (EC2 Public IP)
TTL: 300
```

### Step 8: Verify Frontend Connectivity

The frontend will automatically use the API endpoint configured in `.env.production`:
```
VITE_API_URL=https://api.apexplacements.in
```

Test the complete flow:
1. Navigate to https://www.apexplacements.in
2. Login with HR credentials: `srikanth.hr@apexplacements.in` / `Srikanth@12#*`
3. Verify HR dashboard loads
4. Test CRUD operations

---

## Troubleshooting

### Backend not starting?
```bash
# Check PM2 logs
pm2 logs apex-hr-backend

# Restart application
pm2 restart apex-hr-backend

# Check Node.js version
node --version

# Check npm packages
npm ls
```

### Database connection error?
```bash
# Test database connection from EC2
mysql -h apexdb.cd2mcguiedkw.ap-south-1.rds.amazonaws.com -u root -p apex_portal -e "SELECT 1"

# Check .env file
cat /home/ubuntu/apex-hr-portal/.env
```

### Nginx issues?
```bash
# Test Nginx config
sudo nginx -t

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### SSL certificate issues?
```bash
# Check certificate status
sudo certbot certificates

# Renew certificates
sudo certbot renew

# View Certbot logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

---

## Production Monitoring

### Set up log rotation

```bash
# Create log rotation config
sudo nano /etc/logrotate.d/apex-api
```

Add:
```
/var/log/pm2.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 ubuntu ubuntu
}
```

### Monitor application health

```bash
# View real-time status
pm2 monit

# Get detailed status
pm2 show apex-hr-backend

# Enable auto-restart on reboot
pm2 startup
pm2 save
```

### Set up alerts

```bash
# Monitor PM2 with email alerts
pm2 web

# Access monitoring dashboard
# http://localhost:9615
```

---

## Deployment Checklist

- [ ] Backend code uploaded to EC2
- [ ] SSH key pair securely stored
- [ ] Deployment script executed successfully
- [ ] Environment variables configured
- [ ] Database connection verified
- [ ] PM2 application running
- [ ] Nginx reverse proxy configured
- [ ] SSL certificate installed
- [ ] DNS A record pointing to EC2
- [ ] Frontend API endpoint updated
- [ ] Login flow tested end-to-end
- [ ] HR dashboard functionality verified
- [ ] All 9 entities tested
- [ ] Production monitoring enabled

---

## Useful Commands

```bash
# SSH into EC2
ssh -i apex-placements.pem ubuntu@ec2-13-207-1-159.ap-south-1.compute.amazonaws.com

# Navigate to app directory
cd /home/ubuntu/apex-hr-portal

# View application logs
pm2 logs apex-hr-backend

# Restart application
pm2 restart apex-hr-backend

# Stop application
pm2 stop apex-hr-backend

# Start application
pm2 start apex-hr-backend

# Delete from PM2
pm2 delete apex-hr-backend

# Reboot EC2 (application restarts automatically)
sudo reboot

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check disk space
df -h

# Check memory usage
free -h

# Check running processes
ps aux | grep node
```

---

## Post-Deployment

1. **Monitor Production**
   - Watch backend logs for errors
   - Monitor database query performance
   - Check API response times

2. **Set Up Backups**
   - Configure RDS automated backups
   - Set up CloudFront cache invalidation

3. **Security Hardening**
   - Configure firewall rules
   - Enable VPC security groups
   - Set up rate limiting in Nginx

4. **Performance Optimization**
   - Enable gzip compression
   - Configure caching headers
   - Set up CloudFront cache policies

5. **User Communication**
   - Notify HR staff of go-live
   - Provide login credentials
   - Set up support contact

---

**Deployment Status**: Ready for Production
**Backend Service**: Available at https://api.apexplacements.in
**Frontend Service**: Available at https://www.apexplacements.in
