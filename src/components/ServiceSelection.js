import React from 'react';
import './ServiceSelection.css';

const ServiceSelection = ({ services, onSelectService, selectedService }) => {
  const handleServiceSelect = (service) => {
    onSelectService(service);
  };

  if (!services || services.length === 0) {
    return (
      <div className="service-selection">
        <h3>Choose a Service</h3>
        <div className="no-services">
          <p>No services available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="service-selection">
      <h3>Выберите услугу</h3>
      <p className="section-description">Выберите услугу, которую хотите заказать</p>
      
      <div className="services-grid">
        {services.map(service => {
          const getServiceIcon = (name) => {
            const nameLower = name.toLowerCase();
            if (nameLower.includes('стриж') || nameLower.includes('haircut')) return 'H';
            if (nameLower.includes('массаж') || nameLower.includes('massage')) return 'M';
            if (nameLower.includes('брит') || nameLower.includes('shave')) return 'S';
            if (nameLower.includes('уклад') || nameLower.includes('styling')) return 'T';
            return 'B';
          };

          return (
            <div 
              key={service._id}
              className={`service-card ${selectedService?._id === service._id ? 'selected' : ''}`}
              onClick={() => handleServiceSelect(service)}
            >
              <div className="service-icon">
                {getServiceIcon(service.name)}
              </div>
              <div className="service-info">
                <h4>{service.name}</h4>
                {service.description && (
                  <p className="service-description">{service.description}</p>
                )}
                <div className="service-details">
                  <span className="service-duration">
                    {service.duration || 60} мин
                  </span>
                  <span className="service-price">
                    {service.price || 0} сум
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSelection;
