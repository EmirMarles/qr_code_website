import React, { useEffect, useState } from 'react';
import { attemptAppRedirect, parseQRCodeFromUrl, trackQRScan } from '../utils/deviceDetection';
import './QRCodeLanding.css';

const QRCodeLanding = ({ onBookWithoutRegistration }) => {
  const [device, setDevice] = useState('unknown');
  const [appDetected, setAppDetected] = useState(false);
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [businessId, setBusinessId] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [businessName, setBusinessName] = useState('Loading Business...');

  useEffect(() => {
    // Parse QR code parameters from URL
    const { businessId: id, qr: qrId, platform } = parseQRCodeFromUrl();
    
    if (id) {
      setBusinessId(id);
      setBusinessName(`Barbershop ${id}`);
    }
    
    if (qrId) {
      console.log('QR Code ID:', qrId);
      // Track the QR scan
      trackQRScan(qrId);
    }

    setDevice(platform);
  }, []);

  useEffect(() => {
    // Attempt to redirect to app if on mobile
    if ((device === 'ios' || device === 'android') && !redirectAttempted && businessId) {
      handleAppRedirect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device, redirectAttempted, businessId]);

  const handleAppRedirect = async () => {
    setRedirectAttempted(true);
    
    if (!businessId) {
      console.warn('No businessId found for app redirect');
      return;
    }

    try {
      const appOpened = await attemptAppRedirect(businessId);
      
      if (!appOpened) {
        // App didn't open, show fallback options
        console.log('App not detected, showing fallback options');
        setAppDetected(false);
      } else {
        setAppDetected(true);
      }
    } catch (error) {
      console.error('App redirect failed:', error);
      setAppDetected(false);
    }
  };

  const handleAppStoreRedirect = (platform) => {
    const storeUrls = {
      ios: 'https://apps.apple.com/app/your-app-id',
      android: 'https://play.google.com/store/apps/details?id=your.package.name'
    };

    if (storeUrls[platform]) {
      window.open(storeUrls[platform], '_blank');
    }
  };

  const handleBookNow = () => {
    onBookWithoutRegistration();
  };

  return (
    <div className="qr-landing">
      <div className="qr-container">
        {/* Header */}
        <div className="qr-header">
          <div className="qr-logo">
            <h1>📱 BookMe</h1>
            <p>Your Barbershop Booking App</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="qr-content">
          {device === 'desktop' ? (
            <div className="desktop-message">
              <div className="desktop-icon">💻</div>
              <h2>Mobile Experience Recommended</h2>
              <p>For the best booking experience, please use your mobile device or download our app.</p>
              
              <div className="desktop-actions">
                <button 
                  className="book-btn primary"
                  onClick={handleBookNow}
                >
                  Book Appointment (Web)
                </button>
                
                <div className="app-links">
                  <button 
                    className="app-btn ios"
                    onClick={() => handleAppStoreRedirect('ios')}
                  >
                    📱 App Store
                  </button>
                  <button 
                    className="app-btn android"
                    onClick={() => handleAppStoreRedirect('android')}
                  >
                    🤖 Google Play
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mobile-content">
              {appDetected ? (
                <div className="app-success">
                  <div className="success-icon">✅</div>
                  <h2>Opening App...</h2>
                  <p>Redirecting you to the BookMe app</p>
                </div>
              ) : (
                <div className="app-options">
                  <div className="app-icon">📱</div>
                  <h2>Welcome to BookMe</h2>
                  <p>Book your barbershop appointment easily</p>

                  <div className="app-buttons">
                    <button 
                      className="app-btn primary"
                      onClick={() => handleAppStoreRedirect(device)}
                    >
                      {device === 'ios' ? '📱 Download from App Store' : '🤖 Download from Google Play'}
                    </button>
                  </div>

                  <div className="divider">
                    <span>or</span>
                  </div>

                  <div className="web-option">
                    <button 
                      className="book-btn secondary"
                      onClick={handleBookNow}
                    >
                      Book Without Registration
                    </button>
                    <p className="web-note">Quick booking without downloading the app</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="qr-features">
          <h3>Why Choose BookMe?</h3>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <h4>Quick Booking</h4>
              <p>Book appointments in seconds</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📅</div>
              <h4>Easy Scheduling</h4>
              <p>Choose your preferred time slot</p>
            </div>
            <div className="feature">
              <div className="feature-icon">👨‍💼</div>
              <h4>Expert Barbers</h4>
              <p>Professional barbers at your service</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔔</div>
              <h4>Reminders</h4>
              <p>Never miss an appointment</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="qr-footer">
          <p>© 2024 BookMe. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeLanding;
