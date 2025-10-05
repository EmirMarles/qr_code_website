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
 * App store URLs for BookMe app
 */
export const APP_STORE_URLS = {
  ios: 'https://apps.apple.com/uz/app/bookme-booking-app/id6749165301',
  android: 'https://play.google.com/store/apps/details?id=com.javo3377.bookme',
  web: 'https://bookme.app'
};

/**
 * Generate deep link for BookMe app
 * @param {string} businessId - Business ID
 * @returns {string} Deep link URL
 */
export const generateDeepLink = (businessId) => {
  return `bookme://business/${businessId}`;
};

/**
 * Generate web booking URL
 * @param {string} businessId - Business ID
 * @param {string} qrCodeId - QR Code ID (optional)
 * @returns {string} Web booking URL
 */
export const generateWebBookingUrl = (businessId, qrCodeId) => {
  const qrParam = qrCodeId ? `&qr=${qrCodeId}` : '';
  // Add a parameter to skip QR landing page and go directly to booking
  return `${window.location.origin}/?businessId=${businessId}${qrParam}&direct=true`;
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
 * Attempt to open the native app with fallback options
 * @param {string} businessId - Business ID
 * @param {string} qrCodeId - QR Code ID (optional)
 */
export const attemptAppRedirect = (businessId, qrCodeId) => {
  const platform = detectPlatform();
  
  if (platform === 'desktop') {
    // Desktop users go directly to web booking
    window.location.href = generateWebBookingUrl(businessId, qrCodeId);
    return;
  }

  // Mobile users: try deep link first
  const deepLink = generateDeepLink(businessId);
  
  // Track QR scan
  if (qrCodeId) {
    trackQRScan(qrCodeId);
  }
  
  // Try to open the app immediately
  window.location.href = deepLink;
  
  // Set a timeout to show fallback options if app doesn't open
  setTimeout(() => {
    showFallbackOptions(businessId, qrCodeId, platform);
  }, 2000);
};

/**
 * Show fallback options when app doesn't open
 * @param {string} businessId - Business ID
 * @param {string} qrCodeId - QR Code ID (optional)
 * @param {string} platform - Device platform
 */
export const showFallbackOptions = (businessId, qrCodeId, platform) => {
  // Create fallback UI
  const fallbackContainer = document.createElement('div');
  fallbackContainer.id = 'app-redirect-fallback';
  fallbackContainer.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 20px;
    ">
      <div style="
        background: white;
        border-radius: 16px;
        padding: 24px;
        max-width: 400px;
        width: 100%;
        text-align: center;
      ">
        <h2 style="
          margin: 0 0 16px 0;
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
        ">Открываем приложение BookMe...</h2>
        
        <p style="
          margin: 0 0 24px 0;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.5;
        ">Приложение не открылось? Выберите вариант:</p>
        
        <div style="
          display: flex;
          flex-direction: column;
          gap: 12px;
        ">
          <button id="download-app-btn" style="
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
          ">Скачать приложение</button>
          
          <button id="book-online-btn" style="
            background: #f3f4f6;
            color: #374151;
            border: none;
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
          ">Записаться онлайн</button>
          
          <button id="close-fallback-btn" style="
            background: transparent;
            color: #6b7280;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 16px;
            cursor: pointer;
          ">Закрыть</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(fallbackContainer);
  
  // Add event listeners
  const downloadBtn = document.getElementById('download-app-btn');
  const bookOnlineBtn = document.getElementById('book-online-btn');
  const closeBtn = document.getElementById('close-fallback-btn');
  
  downloadBtn.addEventListener('click', () => {
    const storeUrl = platform === 'ios' ? APP_STORE_URLS.ios : APP_STORE_URLS.android;
    window.open(storeUrl, '_blank');
  });
  
  bookOnlineBtn.addEventListener('click', () => {
    window.location.href = generateWebBookingUrl(businessId, qrCodeId);
  });
  
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(fallbackContainer);
  });
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