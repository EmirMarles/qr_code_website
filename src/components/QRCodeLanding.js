import React, { useEffect, useState } from 'react';
import { parseQRCodeFromUrl, attemptAppRedirect } from '../utils/deviceDetection';
import './QRCodeLanding.css';

const QRCodeLanding = ({ onBookWithoutRegistration }) => {
  // eslint-disable-next-line no-unused-vars
  const [businessId, setBusinessId] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [qrCodeId, setQrCodeId] = useState(null);

  useEffect(() => {
    // Parse QR code parameters from URL
    const { businessId: id, qr: qrId } = parseQRCodeFromUrl();
    
    if (id) {
      setBusinessId(id);
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

  // No actions on landing; we only show welcome + branding while the app may redirect
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="qr-landing">
      <div className="qr-container">
        {/* Main Content */}
        <div className="qr-content">
          <div className="booking-welcome">
            <h2>Добро пожаловать!</h2>
            <p className="welcome-sub">Быстрая и простая онлайн запись</p>
            <p className="welcome-wait">подождите пару секунд…</p>
          </div>
        </div>
        {/* Branding */}
        <div className="powered-by">
          <a
            href="https://bookme.uz"
            target="_blank"
            rel="noopener noreferrer"
            className="powered-link"
            aria-label="Powered by BookMe"
          >
            <span className="powered-text">Powered by</span>
            {/* Brand logo from public folder; fallback to gradient mark if missing */}
            {!logoError ? (
              <img 
                src="/BookMeLogo.jpg" 
                alt="BookMe logo" 
                className="bookme-logo" 
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="bookme-mark" aria-hidden="true" />
            )}
            <span className="bookme-word">BookMe</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default QRCodeLanding;
