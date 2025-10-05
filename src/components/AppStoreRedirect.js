import React, { useState, useEffect } from 'react';
import './AppStoreRedirect.css';

const AppStoreRedirect = () => {
  const [device, setDevice] = useState('unknown');

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      
      if (/iphone|ipad|ipod/.test(userAgent)) {
        setDevice('ios');
      } else if (/android/.test(userAgent)) {
        setDevice('android');
      } else {
        setDevice('desktop');
      }
    };

    detectDevice();
  }, []);

  const handleAppStoreRedirect = (platform) => {
    if (platform === 'ios') {
      window.open('https://apps.apple.com/app/your-app-id', '_blank');
    } else if (platform === 'android') {
      window.open('https://play.google.com/store/apps/details?id=your.package.name', '_blank');
    }
  };

  return (
    <div className="app-store-section">
      <div className="app-store-content">
        <h3>📱 Download Our App</h3>
        <p>Get notifications, manage bookings, and enjoy a better experience!</p>
        
        <div className="app-store-buttons">
          {device === 'ios' && (
            <button 
              className="app-store-btn ios"
              onClick={() => handleAppStoreRedirect('ios')}
            >
              <img 
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                alt="Download on App Store"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline-block';
                }}
              />
              <span style={{ display: 'none' }}>Download on App Store</span>
            </button>
          )}
          
          {device === 'android' && (
            <button 
              className="app-store-btn android"
              onClick={() => handleAppStoreRedirect('android')}
            >
              <img 
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                alt="Get it on Google Play"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline-block';
                }}
              />
              <span style={{ display: 'none' }}>Get it on Google Play</span>
            </button>
          )}
          
          {device === 'desktop' && (
            <div className="both-options">
              <button 
                className="app-store-btn ios"
                onClick={() => handleAppStoreRedirect('ios')}
              >
                <img 
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                  alt="Download on App Store"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline-block';
                  }}
                />
                <span style={{ display: 'none' }}>Download on App Store</span>
              </button>
              <button 
                className="app-store-btn android"
                onClick={() => handleAppStoreRedirect('android')}
              >
                <img 
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                  alt="Get it on Google Play"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline-block';
                  }}
                />
                <span style={{ display: 'none' }}>Get it on Google Play</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppStoreRedirect;
