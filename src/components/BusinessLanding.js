import React, { useState, useEffect } from 'react';
import { fetchBusinessData } from '../services/api';
import './BusinessLanding.css';

const BusinessLanding = ({ businessId, onStartBooking }) => {
  const [business, setBusiness] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBusinessData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const businessData = await fetchBusinessData(businessId);
        if (!businessData) {
          throw new Error('Business not found');
        }
        setBusiness(businessData);
      } catch (err) {
        console.error('Failed to load business data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadBusinessData();
  }, [businessId]);

  if (isLoading) {
    return (
      <div className="business-landing">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="business-landing">
        <div className="error-container">
          <h2>Ошибка загрузки</h2>
          <p>{error || 'Бизнес не найден'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="business-landing">
      <div className="business-card">
        {/* Logo */}
        <div className="business-logo">
          <div className="logo-circle">
            <span className="logo-text">Republic.</span>
            <span className="logo-subtitle">BARBERSHOP</span>
          </div>
        </div>

        {/* Business Name */}
        <div className="business-header">
          <h1 className="business-name">{business.name}</h1>
          <div className="dropdown-chevron">▼</div>
        </div>

        {/* Address */}
        <div className="business-address">
          {business.location?.address || business.address}
        </div>

        {/* Action Button */}
        <button 
          className="select-service-btn"
          onClick={onStartBooking}
        >
          Выбрать услугу
        </button>
      </div>
    </div>
  );
};

export default BusinessLanding;
