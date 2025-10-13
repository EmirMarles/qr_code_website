import React, { useState, useEffect } from 'react';
import './ServiceSelection.css';

const ServiceSelection = ({ services, onSelectService, selectedService, onEditService }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isEditing, setIsEditing] = useState(false);

  const handleServiceSelect = (service) => {
    onSelectService(service);
    setIsCollapsed(true);
    setIsEditing(false);
  };

  const handleChangeService = () => {
    setIsCollapsed(false);
    setIsEditing(true);
    setSearchTerm(''); // Reset search term
    setActiveCategory('all'); // Reset to show all categories
    // Call parent function to reset staff and show all services
    if (onEditService) {
      onEditService();
    }
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleCategorySelect = (categoryName) => {
    setActiveCategory(categoryName);
  };

  // Group services by category for horizontal display
  const groupServicesByCategory = (servicesList) => {
    const grouped = {};
    
    servicesList.forEach(service => {
      const category = service.category || 'Другое';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(service);
    });
    
    return grouped;
  };

  const filteredServices = services?.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const groupedServices = groupServicesByCategory(filteredServices);
  const categoryNames = ['all', ...Object.keys(groupedServices).sort()];

  // Get services for active category
  const getServicesForActiveCategory = () => {
    if (activeCategory === 'all') {
      return filteredServices;
    }
    return groupedServices[activeCategory] || [];
  };

  // Set first category as active by default
  useEffect(() => {
    if (categoryNames.length > 1 && activeCategory === 'all') {
      setActiveCategory('all'); // Keep "Все" as default active
    }
  }, [categoryNames, activeCategory]);

  // Reset state when selectedService changes (when editing)
  useEffect(() => {
    if (!selectedService) {
      setIsCollapsed(false);
      setSearchTerm('');
      setActiveCategory('all');
      setIsEditing(false);
    }
  }, [selectedService]);

  if (!services || services.length === 0) {
    return (
      <div className="service-selection">
        <h3>Выберите услугу</h3>
        <div className="no-services">
          <p>Услуги не доступны в данный момент.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="service-selection">
      <div className="section-header">
        <div className="section-title">
          <h3>Выберите услугу</h3>
          {selectedService && (
            <button className="change-btn" onClick={handleChangeService}>
              Изменить
            </button>
          )}
        </div>
        <p className="section-description">Выберите услугу, которую хотите заказать</p>
      </div>

      {selectedService && isCollapsed ? (
        <div className="selected-service-display">
          <div className="selected-service-item">
            <div className="service-content">
              <h4>Услуга</h4>
              <div className="service-details">
                <span className="selected-service-name">{selectedService.name}</span>
                <span className="selected-service-price">
                  {selectedService.discount 
                    ? ((selectedService.price || 0) * (1 - selectedService.discount / 100)).toLocaleString() + ' сум'
                    : (selectedService.price?.toLocaleString() || '0') + ' сум'
                  }
                </span>
              </div>
            </div>
            <div className="selection-checkmark">✓</div>
          </div>
        </div>
      ) : (
        <>
          <div className="search-container">
            <input
              type="text"
              placeholder="Поиск услуг..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Horizontal Category Tabs */}
          {categoryNames.length > 1 && (
            <div className="category-tabs">
              {categoryNames.map(categoryName => {
                const isActive = activeCategory === categoryName;
                const displayName = categoryName === 'all' ? 'Все' : categoryName;
                const serviceCount = categoryName === 'all' ? filteredServices.length : (groupedServices[categoryName]?.length || 0);
                
                return (
                  <button
                    key={categoryName}
                    className={`category-tab ${isActive ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(categoryName)}
                  >
                    {displayName}
                    {serviceCount > 0 && <span className="tab-count">({serviceCount})</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* Services List for Active Category */}
          <div className="services-list">
            {getServicesForActiveCategory().map(service => {
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
                  className={`service-list-item ${selectedService?._id === service._id ? 'selected' : ''}`}
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="service-icon-small">
                    {getServiceIcon(service.name)}
                  </div>
                  <div className="service-content">
                    <h4>{service.name}</h4>
                    <div className="service-meta">
                      <span className="service-duration">
                        {service.duration || 60} мин
                      </span>
                      <div className="price-container">
                        {service.discount ? (
                          <>
                            <span className="original-price">{service.price?.toLocaleString() || '0'} сум</span>
                            <span className="discounted-price">{((service.price || 0) * (1 - service.discount / 100)).toLocaleString()} сум</span>
                            <span className="discount-badge">-{service.discount}%</span>
                          </>
                        ) : (
                          <span className="service-price">{service.price?.toLocaleString() || '0'} сум</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedService?._id === service._id && (
                    <div className="selection-checkmark-small">
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </>
      )}
    </div>
  );
};

export default ServiceSelection;
