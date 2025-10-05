import React, { useEffect, useState } from 'react';
import './DesktopRedirect.css';

const DesktopRedirect = ({ onRedirectComplete }) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRedirect = () => {
    // Check if there's a booking URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const bookingUrl = urlParams.get('bookingUrl');
    
    if (bookingUrl) {
      // Redirect to the specified booking URL
      window.location.href = bookingUrl;
    } else {
      // Continue to the booking page
      onRedirectComplete();
    }
  };

  const handleSkipRedirect = () => {
    onRedirectComplete();
  };

  return (
    <div className="desktop-redirect">
      <div className="redirect-content">
        <div className="redirect-icon">📱</div>
        <h2>Welcome to Our Booking System</h2>
        <p>You're accessing this page from a desktop device.</p>
        <p>For the best experience, we recommend using our mobile app.</p>
        
        <div className="countdown-section">
          <p>Continuing to booking page in:</p>
          <div className="countdown-number">{countdown}</div>
        </div>

        <div className="redirect-actions">
          <button 
            className="skip-btn"
            onClick={handleSkipRedirect}
          >
            Continue Now
          </button>
        </div>

        <div className="app-store-promotion">
          <p>📱 Download our mobile app for a better experience!</p>
          <div className="app-links">
            <a 
              href="https://apps.apple.com/app/your-app-id" 
              target="_blank" 
              rel="noopener noreferrer"
              className="app-link"
            >
              App Store
            </a>
            <a 
              href="https://play.google.com/store/apps/details?id=your.package.name" 
              target="_blank" 
              rel="noopener noreferrer"
              className="app-link"
            >
              Google Play
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopRedirect;
