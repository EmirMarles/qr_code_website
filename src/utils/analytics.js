// Analytics and tracking utilities

// Google Analytics event tracking
export const trackEvent = (action, category, label, value) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
  
  // Fallback for other analytics services
  if (typeof analytics !== 'undefined') {
    analytics.track(action, {
      category,
      label,
      value
    });
  }
  
  // Console logging for development
  console.log('Analytics Event:', { action, category, label, value });
};

// Track booking flow events
export const trackBookingEvent = (eventType, data = {}) => {
  const events = {
    page_view: () => trackEvent('page_view', 'booking', 'booking_page'),
    service_selected: (service) => trackEvent('select_service', 'booking', service?.name, service?.price),
    staff_selected: (staff) => trackEvent('select_staff', 'booking', staff?.fullName),
    date_selected: (date) => trackEvent('select_date', 'booking', date),
    time_selected: (time) => trackEvent('select_time', 'booking', time),
    form_started: () => trackEvent('form_start', 'booking', 'booking_form'),
    booking_submitted: (bookingData) => trackEvent('submit_booking', 'booking', 'booking_form', bookingData?.service?.price),
    booking_success: (bookingId) => trackEvent('booking_success', 'conversion', bookingId),
    booking_error: (error) => trackEvent('booking_error', 'error', error),
    app_store_click: (platform) => trackEvent('app_store_click', 'engagement', platform)
  };
  
  if (events[eventType]) {
    events[eventType](data);
  }
};

// Track conversion (successful booking)
export const trackConversion = (bookingId, value) => {
  // Google Analytics conversion tracking
  if (typeof gtag !== 'undefined') {
    gtag('event', 'purchase', {
      transaction_id: bookingId,
      value: value,
      currency: 'USD'
    });
  }
  
  // Facebook Pixel conversion tracking
  if (typeof fbq !== 'undefined') {
    fbq('track', 'Purchase', {
      value: value,
      currency: 'USD'
    });
  }
  
  console.log('Conversion Tracked:', { bookingId, value });
};

// Track page performance
export const trackPagePerformance = () => {
  if (typeof performance !== 'undefined' && performance.timing) {
    const timing = performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    
    trackEvent('page_load_time', 'performance', 'booking_page', loadTime);
  }
};

// Initialize analytics
export const initializeAnalytics = () => {
  // Track page view
  trackBookingEvent('page_view');
  
  // Track page performance
  trackPagePerformance();
  
  // Track device type
  const device = navigator.userAgent.toLowerCase().includes('mobile') ? 'mobile' : 'desktop';
  trackEvent('device_type', 'user', device);
};
