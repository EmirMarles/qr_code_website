import React, { useEffect, useState } from 'react';
import { parseQRCodeFromUrl, attemptAppRedirect } from '../utils/deviceDetection';
import './QRCodeLanding.css';

const QRCodeLanding = ({ onBookWithoutRegistration }) => {
  // eslint-disable-next-line no-unused-vars
  const [businessId, setBusinessId] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [qrCodeId, setQrCodeId] = useState(null);
  const [businessName, setBusinessName] = useState('Loading Business...');

  useEffect(() => {
    // Parse QR code parameters from URL
    const { businessId: id, qr: qrId } = parseQRCodeFromUrl();
    
    if (id) {
      setBusinessId(id);
      setBusinessName(`Barbershop ${id}`);
    }
    
    if (qrId) {
      setQrCodeId(qrId);
      console.log('QR Code ID:', qrId);
    }

    // Attempt app redirection if we have business ID
    if (id) {
      attemptAppRedirect(id, qrId);
    }
  }, []);

  const handleBookNow = () => {
    onBookWithoutRegistration();
  };

  const handleDownloadApp = () => {
    const platform = parseQRCodeFromUrl().platform;
    const { APP_STORE_URLS } = require('../utils/deviceDetection');
    const storeUrl = platform === 'ios' ? APP_STORE_URLS.ios : APP_STORE_URLS.android;
    window.open(storeUrl, '_blank');
  };

  return (
    <div className="qr-landing">
      <div className="qr-container">
        {/* Header */}
        <div className="qr-header">
          <div className="qr-logo">
            <h1>💈 {businessName}</h1>
            <p>Book your appointment online</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="qr-content">
          <div className="booking-welcome">
            <div className="welcome-icon">B</div>
            <h2>Welcome!</h2>
            <p>Ready to book your barbershop appointment? Click below to get started.</p>
            
                <div className="booking-action">
                  <button 
                    className="book-btn primary"
                    onClick={handleBookNow}
                  >
                    Book Appointment Now
                  </button>
                  <button 
                    className="book-btn secondary"
                    onClick={handleDownloadApp}
                  >
                    Download App
                  </button>
                  <p className="booking-note">Quick and easy online booking</p>
                </div>
          </div>
        </div>

        {/* Features */}
        <div className="qr-features">
          <h3>Why Choose Us?</h3>
          <div className="features-grid">
                <div className="feature">
                  <div className="feature-icon">Q</div>
                  <h4>Quick Booking</h4>
                  <p>Book appointments in seconds</p>
                </div>
                <div className="feature">
                  <div className="feature-icon">S</div>
                  <h4>Easy Scheduling</h4>
                  <p>Choose your preferred time slot</p>
                </div>
                <div className="feature">
                  <div className="feature-icon">E</div>
                  <h4>Expert Barbers</h4>
                  <p>Professional barbers at your service</p>
                </div>
                <div className="feature">
                  <div className="feature-icon">R</div>
                  <h4>Reminders</h4>
                  <p>Never miss an appointment</p>
                </div>
          </div>
        </div>

        {/* Footer */}
        <div className="qr-footer">
          <p>© 2024 {businessName}. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeLanding;
