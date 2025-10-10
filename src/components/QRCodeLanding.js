import React, { useEffect, useState } from 'react';
import { parseQRCodeFromUrl, attemptAppRedirect } from '../utils/deviceDetection';
import { fetchBusinessData } from '../services/api';
import './QRCodeLanding.css';

const QRCodeLanding = ({ onBookWithoutRegistration }) => {
  const [businessId, setBusinessId] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [qrCodeId, setQrCodeId] = useState(null);
  const [business, setBusiness] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);

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

  useEffect(() => {
    const loadBusinessData = async () => {
      if (!businessId) return;
      
      try {
        setIsLoading(true);
        const businessData = await fetchBusinessData(businessId);
        setBusiness(businessData);
      } catch (err) {
        console.error('Failed to load business data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBusinessData();
  }, [businessId]);

  const handleServiceClick = () => {
    onBookWithoutRegistration();
  };

  if (isLoading) {
    return (
      <div className="qr-landing">
        <div className="qr-container">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="qr-landing">
      <div className="qr-container">
        {/* Business Header */}
        <div className="business-header">
          <div className="business-logo">
            <div className="logo-circle">
              <span className="logo-text">Republic.</span>
              <span className="logo-subtext">BARBERSHOP</span>
            </div>
          </div>
          
          <div className="business-info">
            <h1 className="business-name">
              {business?.name || 'REPUBLIC'}
              <span className="dropdown-arrow">▼</span>
            </h1>
            <p className="business-address">
              {business?.location?.address || business?.address || 'Мирабад 39'}
            </p>
          </div>
        </div>

        {/* Service Options */}
        <div className="service-options">
          <div className="service-option" onClick={handleServiceClick}>
            <div className="service-icon">
              <div className="icon-staff">👥</div>
            </div>
            <span className="service-text">Выбрать специалиста</span>
            <span className="service-arrow">›</span>
          </div>

          <div className="service-option" onClick={handleServiceClick}>
            <div className="service-icon">
              <div className="icon-calendar">📅</div>
            </div>
            <span className="service-text">Выбрать дату и время</span>
            <span className="service-arrow">›</span>
          </div>

          <div className="service-option" onClick={handleServiceClick}>
            <div className="service-icon">
              <div className="icon-list">☰</div>
            </div>
            <span className="service-text">Выбрать услуги</span>
            <span className="service-arrow">›</span>
          </div>
        </div>

        {/* Powered by */}
        <div className="powered-by">
          <a
            href="https://bookme.uz"
            target="_blank"
            rel="noopener noreferrer"
            className="powered-link"
            aria-label="Powered by BookMe"
          >
            <span className="powered-text">Powered by</span>
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
