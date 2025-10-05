import React from 'react';
import './BusinessInfoModal.css';

const BusinessInfoModal = ({ business, onClose }) => {
  const formatBusinessHours = (hours) => {
    if (!hours || !Array.isArray(hours)) {
      return <p>Часы работы не указаны</p>;
    }

    const today = new Date().toLocaleDateString('ru-RU', { weekday: 'long' });

    return hours.map(day => {
      const isToday = day.day.toLowerCase() === today.toLowerCase();
      
      return (
        <div key={day.day} className={`business-hour ${isToday ? 'today' : ''}`}>
          <span className="day">{day.day}</span>
          <span className="hours">
            {day.isOpen ? `${day.open} - ${day.close}` : 'Закрыто'}
          </span>
        </div>
      );
    });
  };

  const openInGoogleMaps = (address) => {
    if (!address) return;
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  if (!business) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="business-info-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Информация о бизнесе</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          {(business.location && business.location.address) || business.address ? (
            <div className="info-section">
              <h3>Адрес</h3>
              <button 
                onClick={() => openInGoogleMaps(business.location?.address || business.address)}
                className="address-link"
              >
                {business.location?.address || business.address}
                <span>→</span>
              </button>
            </div>
          ) : null}

          {business.businessHours && business.businessHours.length > 0 && (
            <div className="info-section">
              <h3>Часы работы</h3>
              <div className="hours-list">
                {formatBusinessHours(business.businessHours)}
              </div>
            </div>
          )}

          {business.paymentOptions && business.paymentOptions.length > 0 && (
            <div className="info-section">
              <h3>Способы оплаты</h3>
              <div className="payment-methods">
                {business.paymentOptions.map((method, index) => (
                  <span key={index} className="payment-method">
                    {method === 'card' ? 'Карта' : 
                     method === 'cash' ? 'Наличные' : 
                     method === 'online' ? 'Онлайн' : 
                     method}
                  </span>
                ))}
              </div>
            </div>
          )}

          {business.phone && (
            <div className="info-section">
              <h3>Контакт</h3>
              <a href={`tel:${business.phone}`} className="phone-link">
                {business.phone}
              </a>
            </div>
          )}

          {business.instagramLink && (
            <div className="info-section">
              <h3>Подписывайтесь</h3>
              <a 
                href={business.instagramLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="instagram-link"
              >
                Instagram
              </a>
            </div>
          )}

          {business.description && (
            <div className="info-section">
              <h3>Описание</h3>
              <p className="business-description">{business.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoModal;
