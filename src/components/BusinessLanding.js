import React from 'react';
import './BusinessLanding.css';

const BusinessLanding = ({ businessId, onStartBooking }) => {
  // Static business data matching the reference image
  const business = {
    name: "FIRE",
    address: "789V+64P, Ташкент, Tashkent, Узбекистан"
  };

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

        {/* Tagline */}
        <div className="business-tagline">
          Barbershop & Style
        </div>

        {/* Address */}
        <div className="business-address">
          {business.address}
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
