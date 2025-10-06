import React, { useState, useEffect } from 'react';
import './ServiceSelection.css';

const ServiceSelection = ({ services, onSelectService, selectedService }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  const handleServiceSelect = (service) => {
    onSelectService(service);
    setIsCollapsed(true);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  // Group services by category (only services with categories)
  const groupServicesByCategory = (servicesList) => {
    const grouped = {};
    const uncategorized = [];
    
    servicesList.forEach(service => {
      if (service.category) {
        if (!grouped[service.category]) {
          grouped[service.category] = [];
        }
        grouped[service.category].push(service);
      } else {
        uncategorized.push(service);
      }
    });
    
    return { grouped, uncategorized };
  };

  const filteredServices = services?.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const { grouped: groupedServices, uncategorized: uncategorizedServices } = groupServicesByCategory(filteredServices);
  const categoryNames = Object.keys(groupedServices).sort();

  // Expand first category by default
  useEffect(() => {
    if (categoryNames.length > 0 && Object.keys(expandedCategories).length === 0) {
      setExpandedCategories({ [categoryNames[0]]: true });
    }
  }, [categoryNames, expandedCategories]);

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
            <button className="collapse-btn" onClick={handleToggleCollapse}>
              {isCollapsed ? 'Изменить' : 'Свернуть'}
            </button>
          )}
        </div>
        <p className="section-description">Выберите услугу, которую хотите заказать</p>
      </div>

      {selectedService && isCollapsed ? (
        <div className="selected-service-summary">
          <div className="selected-service-card">
            <div className="service-icon">
              {(() => {
                const nameLower = selectedService.name.toLowerCase();
                if (nameLower.includes('стриж') || nameLower.includes('haircut')) return 'H';
                if (nameLower.includes('массаж') || nameLower.includes('massage')) return 'M';
                if (nameLower.includes('брит') || nameLower.includes('shave')) return 'S';
                if (nameLower.includes('уклад') || nameLower.includes('styling')) return 'T';
                return 'B';
              })()}
            </div>
            <div className="service-info">
              <h4>{selectedService.name}</h4>
              {selectedService.category && (
                <div className="service-category">
                  {selectedService.category}
                </div>
              )}
              <div className="service-details">
                <span>{selectedService.duration || 60} мин</span>
                <span>{selectedService.price || 0} сум</span>
              </div>
            </div>
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

          {/* Uncategorized services - displayed normally */}
          {uncategorizedServices.length > 0 && (
            <div className="services-grid compact">
              {uncategorizedServices.map(service => {
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
                    className={`service-card compact ${selectedService?._id === service._id ? 'selected' : ''}`}
                    onClick={() => handleServiceSelect(service)}
                  >
                    <div className="service-icon">
                      {getServiceIcon(service.name)}
                    </div>
                    <div className="service-info">
                      <h4>{service.name}</h4>
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
          )}

          {/* Categorized services - displayed in accordion */}
          {categoryNames.length > 0 && (
            <div className="services-accordion">
              {categoryNames.map(categoryName => {
                const categoryServices = groupedServices[categoryName];
                const isExpanded = expandedCategories[categoryName] || false;
                
                return (
                  <div key={categoryName} className="category-section">
                    <div 
                      className="category-header"
                      onClick={() => toggleCategory(categoryName)}
                    >
                      <div className="category-title">
                        <span className="category-name">{categoryName}</span>
                        <span className="category-count">({categoryServices.length})</span>
                      </div>
                      <div className={`category-arrow ${isExpanded ? 'expanded' : ''}`}>
                        ▼
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="category-content">
                        <div className="services-grid compact">
                          {categoryServices.map(service => {
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
                                className={`service-card compact ${selectedService?._id === service._id ? 'selected' : ''}`}
                                onClick={() => handleServiceSelect(service)}
                              >
                                <div className="service-icon">
                                  {getServiceIcon(service.name)}
                                </div>
                                <div className="service-info">
                                  <h4>{service.name}</h4>
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
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default ServiceSelection;
