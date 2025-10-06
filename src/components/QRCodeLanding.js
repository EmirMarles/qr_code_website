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
        {/* Main Content */}
        <div className="qr-content">
          <div className="booking-welcome">
            <h2>Добро пожаловать!</h2>
            <p>Готовы записаться на прием? Нажмите ниже, чтобы начать.</p>
            
                <div className="booking-action">
                  <button 
                    className="book-btn primary"
                    onClick={handleBookNow}
                  >
                    Записаться на прием
                  </button>
                  <button 
                    className="book-btn secondary"
                    onClick={handleDownloadApp}
                  >
                    Скачать приложение
                  </button>
                  <p className="booking-note">Быстрая и простая онлайн запись</p>
                </div>
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
            <span className="bookme-mark" aria-hidden="true">
              {/* Simple BookMe mark (inline SVG) */}
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="bmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <rect x="2" y="3" width="20" height="18" rx="4" fill="url(#bmGrad)"/>
                <path d="M7 8h6M7 12h10M7 16h8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <span className="bookme-word">BookMe</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default QRCodeLanding;
