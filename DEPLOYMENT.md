# Deployment Guide for Render

This guide will help you deploy the QR Code Booking Website to Render.

## Prerequisites

1. A Render account (free tier available)
2. Your backend API running at: `https://bookme-backend-536445311459.europe-central2.run.app`
3. Git repository with your code

## Deployment Steps

### Option 1: Deploy via Render Dashboard (Recommended)

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Static Site"
   - Connect your GitHub/GitLab repository

2. **Configure Build Settings**
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Node Version**: 18

3. **Environment Variables**
   Add these environment variables in Render:
   ```
   REACT_APP_API_URL=https://bookme-backend-536445311459.europe-central2.run.app/api
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Render will automatically build and deploy your app

### Option 2: Deploy via Render CLI

1. **Install Render CLI**
   ```bash
   npm install -g @render/cli
   ```

2. **Login to Render**
   ```bash
   render login
   ```

3. **Deploy**
   ```bash
   render deploy
   ```

### Option 3: Deploy via Docker

1. **Build Docker Image**
   ```bash
   docker build -t qr-booking-website .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:80 qr-booking-website
   ```

## Environment Variables

### Required Variables
- `REACT_APP_API_URL`: Your backend API URL
- `NODE_ENV`: Set to `production`

### Optional Variables
- `REACT_APP_GOOGLE_ANALYTICS_ID`: Google Analytics tracking ID
- `REACT_APP_FACEBOOK_PIXEL_ID`: Facebook Pixel ID
- `REACT_APP_APPLE_APP_URL`: App Store URL
- `REACT_APP_GOOGLE_PLAY_URL`: Google Play Store URL

## Custom Domain Setup

1. **Add Custom Domain**
   - In Render dashboard, go to your static site
   - Click "Custom Domains"
   - Add your domain

2. **Configure DNS**
   - Add a CNAME record pointing to your Render URL
   - Example: `booking.yourdomain.com` → `your-app.onrender.com`

## SSL Certificate

Render automatically provides SSL certificates for:
- Default Render subdomains
- Custom domains

## Performance Optimization

### Build Optimization
- The app is already optimized for production
- Minified CSS and JavaScript
- Optimized images and assets

### CDN
- Render automatically serves your site through a global CDN
- Static assets are cached for optimal performance

## Monitoring and Logs

### View Logs
- Go to your service in Render dashboard
- Click "Logs" tab to view build and runtime logs

### Health Checks
- Render automatically monitors your site
- Alerts are sent if the site goes down

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are in package.json
   - Check build logs for specific errors

2. **API Connection Issues**
   - Verify `REACT_APP_API_URL` is correct
   - Check if backend API is accessible
   - Ensure CORS is configured on backend

3. **Environment Variables Not Working**
   - Variables must start with `REACT_APP_`
   - Redeploy after adding new variables
   - Check variable names for typos

### Debug Mode
To enable debug mode, add:
```
REACT_APP_DEBUG=true
```

## Scaling

### Free Tier Limits
- 750 hours/month
- 100GB bandwidth/month
- Sleeps after 15 minutes of inactivity

### Paid Plans
- Always-on instances
- More bandwidth
- Priority support

## Security

### HTTPS
- All traffic is automatically redirected to HTTPS
- SSL certificates are automatically managed

### Security Headers
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Content Security Policy (can be added)

## Backup and Recovery

### Code Backup
- Your code is stored in Git repository
- Render creates automatic backups of your deployments

### Data Backup
- Backend data should be backed up separately
- Consider database backups for production

## Support

### Render Support
- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [Render Status](https://status.render.com)

### Application Support
- Check application logs in Render dashboard
- Monitor API connectivity
- Verify environment variables

## Cost Estimation

### Free Tier
- Perfect for development and testing
- Limited to 750 hours/month
- Sleeps after inactivity

### Paid Plans
- Starter: $7/month
- Standard: $25/month
- Pro: $85/month

Choose based on your traffic and requirements.

## Next Steps

After deployment:

1. Test all functionality
2. Set up monitoring
3. Configure custom domain
4. Set up analytics
5. Test on different devices
6. Monitor performance

Your booking website will be live at: `https://your-app-name.onrender.com`
