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
      <h3>Choose a Service</h3>
      <p className="section-description">Select the service you'd like to book</p>
      
      <div className="services-grid">
        {services.map(service => (
          <div 
            key={service._id}
            className={`service-card ${selectedService?._id === service._id ? 'selected' : ''}`}
            onClick={() => handleServiceSelect(service)}
          >
            <div className="service-info">
              <h4>{service.name}</h4>
              {service.description && (
                <p className="service-description">{service.description}</p>
              )}
              <div className="service-details">
                <span className="service-duration">
                  ⏱️ {service.duration || 60} minutes
                </span>
                <span className="service-price">
                  💰 ${service.price || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;
