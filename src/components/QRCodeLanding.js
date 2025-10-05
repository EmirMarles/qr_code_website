import React, { useEffect, useState } from 'react';
import { parseQRCodeFromUrl, trackQRScan } from '../utils/deviceDetection';
import './QRCodeLanding.css';

const QRCodeLanding = ({ onBookWithoutRegistration }) => {
  // eslint-disable-next-line no-unused-vars
  const [businessId, setBusinessId] = useState(null);
  const [businessName, setBusinessName] = useState('Loading Business...');

  useEffect(() => {
    // Parse QR code parameters from URL
    const { businessId: id, qr: qrId } = parseQRCodeFromUrl();
    
    if (id) {
      setBusinessId(id);
      setBusinessName(`Barbershop ${id}`);
    }
    
    if (qrId) {
      console.log('QR Code ID:', qrId);
      // Track the QR scan
      trackQRScan(qrId);
    }
  }, []);

  const handleBookNow = () => {
    onBookWithoutRegistration();
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
            <div className="welcome-icon">✂️</div>
            <h2>Welcome!</h2>
            <p>Ready to book your barbershop appointment? Click below to get started.</p>
            
            <div className="booking-action">
              <button 
                className="book-btn primary"
                onClick={handleBookNow}
              >
                Book Appointment Now
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
          <p>© 2024 {businessName}. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeLanding;
