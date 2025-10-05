import React from 'react';
import './BusinessInfo.css';

const BusinessInfo = ({ business }) => {
  const formatBusinessHours = (hours) => {
    if (!hours || !Array.isArray(hours)) {
      return <p>Часы работы не указаны</p>;
    }

    const today = new Date().toLocaleDateString('ru-RU', { weekday: 'long' });

    return hours.map(day => {
      const isToday = day.day.toLowerCase() === today.toLowerCase();
      
      return (
        <div key={day.day} className={`business-hour ${isToday ? 'today' : ''}`}>
          <span className="day">
            {day.day} {isToday && '✅'}
          </span>
          <span className="hours">
            {day.isOpen ? `${day.open} - ${day.close}` : 'Закрыто'}
          </span>
        </div>
      );
    });
  };

  // const generateMapUrl = (address) => {
  //   if (!address) return null;
  //   const encodedAddress = encodeURIComponent(address);
  //   return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=15&size=400x120&markers=color:red%7C${encodedAddress}&key=YOUR_API_KEY`;
  // };

  const openInGoogleMaps = (address) => {
    if (!address) return;
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
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
                <button 
                  onClick={() => openInGoogleMaps(business.location?.address || business.address)}
                  className="address-link"
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  📍 {business.location?.address || business.address}
                  <span>→</span>
                </button>
                <div className="map-preview">
                  <img 
                    src={`https://via.placeholder.com/400x120/f1f5f9/64748b?text=Map+Preview`}
                    alt="Map preview"
                    onClick={() => openInGoogleMaps(business.location?.address || business.address)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
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
