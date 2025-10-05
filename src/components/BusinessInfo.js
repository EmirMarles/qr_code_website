import React from 'react';
import './BusinessInfo.css';

const BusinessInfo = ({ business }) => {
  const formatBusinessHours = (hours) => {
    if (!hours || !Array.isArray(hours)) {
      return <p>Часы работы не указаны</p>;
    }

    return hours.map(day => (
      <div key={day.day} className="business-hour">
        <span className="day">{day.day}</span>
        <span className="hours">
          {day.isOpen ? `${day.open} - ${day.close}` : 'Закрыто'}
        </span>
      </div>
    ));
  };

  if (!business) {
    return null;
  }

  return (
    <div className="business-info">
      <div className="business-header">
        <h2>{business.name}</h2>
        <div className="business-meta">
          {business.category && (
            <span className="category">{business.category}</span>
          )}
          {business.region && (
            <span className="region">{business.region}</span>
          )}
        </div>
        {business.description && (
          <p className="business-description">{business.description}</p>
        )}
      </div>

      <div className="business-details">
        {(business.location && business.location.address) || business.address ? (
          <div className="location">
            <h3>📍 Адрес</h3>
            <p>{business.location?.address || business.address}</p>
          </div>
        ) : null}

        {business.businessHours && business.businessHours.length > 0 && (
          <div className="hours">
            <h3>🕒 Часы работы</h3>
            <div className="hours-list">
              {formatBusinessHours(business.businessHours)}
            </div>
          </div>
        )}

        {business.paymentOptions && business.paymentOptions.length > 0 && (
          <div className="payment-options">
            <h3>💳 Способы оплаты</h3>
            <div className="payment-methods">
              {business.paymentOptions.map((method, index) => (
                <span key={index} className="payment-method">
                  {method === 'card' ? '💳 Карта' : 
                   method === 'cash' ? '💵 Наличные' : 
                   method === 'online' ? '💻 Онлайн' : 
                   `💳 ${method}`}
                </span>
              ))}
            </div>
          </div>
        )}

        {business.instagramLink && (
          <div className="social-links">
            <h3>📱 Подписывайтесь</h3>
            <a 
              href={business.instagramLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="instagram-link"
            >
              📷 Instagram
            </a>
          </div>
        )}

        {business.phone && (
          <div className="contact-info">
            <h3>📞 Контакт</h3>
            <a href={`tel:${business.phone}`} className="phone-link">
              {business.phone}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessInfo;
