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
      </div>
    </div>
  );
};

export default QRCodeLanding;
