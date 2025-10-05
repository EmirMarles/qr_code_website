# 🚀 Render Deployment Guide

## Quick Deployment Steps

### 1. Prepare Your Repository
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: QR Code Booking Website"

# Push to GitHub/GitLab
git remote add origin https://github.com/yourusername/qr-code-booking-website.git
git push -u origin main
```

### 2. Deploy to Render

#### Option A: Via Render Dashboard (Recommended)

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New +" → "Static Site"**
3. **Connect Repository**:
   - Choose your Git provider (GitHub/GitLab)
   - Select your repository
   - Click "Connect"

4. **Configure Build Settings**:
   - **Name**: `qr-code-booking-website`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Node Version**: `18`

5. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://bookme-backend-536445311459.europe-central2.run.app/api
   NODE_ENV=production
   ```

6. **Deploy**:
   - Click "Create Static Site"
   - Wait for deployment to complete
   - Your site will be available at: `https://your-app-name.onrender.com`

#### Option B: Via Render CLI

1. **Install Render CLI**:
   ```bash
   npm install -g @render/cli
   ```

2. **Login**:
   ```bash
   render login
   ```

3. **Deploy**:
   ```bash
   render deploy
   ```

### 3. Custom Domain Setup (Optional)

1. **In Render Dashboard**:
   - Go to your static site
   - Click "Custom Domains"
   - Add your domain (e.g., `booking.yourdomain.com`)

2. **Configure DNS**:
   - Add CNAME record: `booking.yourdomain.com` → `your-app-name.onrender.com`

## 🔧 Configuration Details

### Environment Variables
```env
REACT_APP_API_URL=https://bookme-backend-536445311459.europe-central2.run.app/api
NODE_ENV=production
REACT_APP_GOOGLE_ANALYTICS_ID=your-ga-id (optional)
REACT_APP_FACEBOOK_PIXEL_ID=your-pixel-id (optional)
```

### Build Configuration
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`
- **Node Version**: `18`
- **Auto-Deploy**: Enabled (deploys on every push to main branch)

## 📊 Performance Features

### Automatic Optimizations
- ✅ Minified CSS and JavaScript
- ✅ Optimized images and assets
- ✅ Gzip compression
- ✅ Global CDN delivery
- ✅ HTTP/2 support
- ✅ Automatic HTTPS

### Caching Strategy
- Static assets: 1 year cache
- HTML files: No cache (for updates)
- API responses: No cache (for real-time data)

## 🔍 Testing Your Deployment

### 1. Basic Functionality
- [ ] Page loads correctly
- [ ] Business information displays
- [ ] Service selection works
- [ ] Staff selection works
- [ ] Date/time selection works
- [ ] Booking form submits
- [ ] Success modal appears

### 2. Mobile Testing
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] App store buttons display correctly

### 3. Performance Testing
- [ ] Page loads quickly (< 3 seconds)
- [ ] Images load properly
- [ ] No console errors

## 🚨 Troubleshooting

### Common Issues

#### Build Fails
```bash
# Check Node.js version
node --version  # Should be 18+

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### API Connection Issues
- Verify `REACT_APP_API_URL` is correct
- Check if backend API is accessible
- Ensure CORS is configured on backend

#### Environment Variables Not Working
- Variables must start with `REACT_APP_`
- Redeploy after adding new variables
- Check variable names for typos

### Debug Mode
Add this environment variable for debugging:
```
REACT_APP_DEBUG=true
```

## 📈 Monitoring

### Render Dashboard
- View deployment logs
- Monitor performance metrics
- Check error rates
- View build history

### Application Monitoring
- Browser console for client-side errors
- Network tab for API issues
- Performance tab for speed issues

## 🔄 Updates and Maintenance

### Automatic Deployments
- Every push to main branch triggers deployment
- Build logs available in Render dashboard
- Rollback to previous version if needed

### Manual Deployments
```bash
# Trigger manual deployment
git push origin main
```

### Environment Updates
1. Update environment variables in Render dashboard
2. Redeploy to apply changes
3. Test functionality

## 💰 Cost Information

### Free Tier
- 750 hours/month
- 100GB bandwidth/month
- Sleeps after 15 minutes of inactivity
- Perfect for development and testing

### Paid Plans
- **Starter**: $7/month - Always-on, 100GB bandwidth
- **Standard**: $25/month - Always-on, 1TB bandwidth
- **Pro**: $85/month - Always-on, 2TB bandwidth, priority support

## 🎯 Next Steps After Deployment

1. **Test Everything**:
   - Test on different devices
   - Test booking flow end-to-end
   - Verify API connections

2. **Set Up Monitoring**:
   - Configure error tracking
   - Set up performance monitoring
   - Monitor booking conversions

3. **Optimize**:
   - Analyze performance metrics
   - Optimize images and assets
   - Implement caching strategies

4. **Marketing**:
   - Share the booking link
   - Add to business website
   - Promote on social media

## 📞 Support

### Render Support
- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [Render Status](https://status.render.com)

### Application Support
- Check deployment logs in Render dashboard
- Monitor API connectivity
- Verify environment variables

## 🎉 Success!

Your QR Code Booking Website is now live and ready for customers to book appointments!

**Live URL**: `https://your-app-name.onrender.com`

**Features Working**:
- ✅ App store redirects
- ✅ Guest booking
- ✅ Service selection
- ✅ Staff selection
- ✅ Date/time booking
- ✅ Responsive design
- ✅ Backend integration
- ✅ SEO optimization

Happy booking! 🎊
