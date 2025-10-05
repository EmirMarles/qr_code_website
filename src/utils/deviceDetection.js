/**
 * Device Detection Utilities
 * Based on backend deviceDetection.js
 */

/**
 * Detect the user's platform
 * @returns {string} 'ios', 'android', or 'desktop'
 */
export const detectPlatform = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios';
  } else if (/android/.test(userAgent)) {
    return 'android';
  } else {
    return 'desktop';
  }
};

/**
 * Check if the device is mobile
 * @returns {boolean}
 */
export const isMobile = () => {
  const platform = detectPlatform();
  return platform === 'ios' || platform === 'android';
};

/**
 * Generate smart redirect URLs for QR codes
 * @param {string} businessId - Business ID
 * @param {string} qrCodeId - QR Code ID (optional)
 * @returns {object} URLs for different platforms
 */
export const generateSmartRedirectUrls = (businessId, qrCodeId = null) => {
  const baseUrl = window.location.origin;
  const qrParam = qrCodeId ? `&qr=${qrCodeId}` : '';
  
  return {
    web: `${baseUrl}?businessId=${businessId}${qrParam}`,
    ios: `your-app-scheme://booking?businessId=${businessId}${qrParam}`,
    android: `your-app-scheme://booking?businessId=${businessId}${qrParam}`,
    appStore: {
      ios: 'https://apps.apple.com/app/your-app-id',
      android: 'https://play.google.com/store/apps/details?id=your.package.name'
    }
  };
};

/**
 * Track QR code scan
 * @param {string} qrCodeId - QR Code ID
 * @returns {Promise} - API response
 */
export const trackQRScan = async (qrCodeId) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://bookme-backend-536445311459.europe-central2.run.app/api'}/qrcodes/${qrCodeId}/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: detectPlatform()
      })
    });
    
    if (response.ok) {
      console.log('QR scan tracked successfully');
    }
  } catch (error) {
    console.error('Failed to track QR scan:', error);
  }
};

/**
 * Get QR code information
 * @param {string} qrCodeId - QR Code ID
 * @returns {Promise} - QR code info
 */
export const getQRCodeInfo = async (qrCodeId) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://bookme-backend-536445311459.europe-central2.run.app/api'}/qrcodes/info/${qrCodeId}`);
    
    if (response.ok) {
      return await response.json();
    } else {
      console.warn('QR code info not found');
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch QR code info:', error);
    return null;
  }
};

/**
 * Attempt to open the native app
 * @param {string} businessId - Business ID
 * @param {string} qrCodeId - QR Code ID (optional)
 * @returns {Promise} - Whether app opened successfully
 */
export const attemptAppRedirect = async (businessId, qrCodeId = null) => {
  const platform = detectPlatform();
  
  if (platform === 'desktop') {
    return false;
  }
  
  const urls = generateSmartRedirectUrls(businessId, qrCodeId);
  const appUrl = urls[platform];
  
  try {
    // Track the scan attempt
    if (qrCodeId) {
      await trackQRScan(qrCodeId);
    }
    
    // Create hidden iframe to attempt app launch
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = appUrl;
    document.body.appendChild(iframe);
    
    // Set timeout to detect if app opened
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        // App didn't open, clean up and resolve false
        document.body.removeChild(iframe);
        resolve(false);
      }, 2000);
      
      // Listen for visibility change (app opened)
      const handleVisibilityChange = () => {
        if (document.hidden) {
          clearTimeout(timeout);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          resolve(true);
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
    });
  } catch (error) {
    console.error('App redirect failed:', error);
    return false;
  }
};

/**
 * Get business redirect URL
 * @param {string} businessId - Business ID
 * @param {string} qrCodeId - QR Code ID (optional)
 * @returns {string} - Redirect URL
 */
export const getBusinessRedirectUrl = (businessId, qrCodeId = null) => {
  const baseUrl = window.location.origin;
  const qrParam = qrCodeId ? `&qr=${qrCodeId}` : '';
  return `${baseUrl}?businessId=${businessId}${qrParam}`;
};

/**
 * Parse QR code parameters from URL
 * @returns {object} - Parsed parameters
 */
export const parseQRCodeFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    businessId: urlParams.get('businessId'),
    qr: urlParams.get('qr'),
    platform: detectPlatform(),
    isMobile: isMobile()
  };
};