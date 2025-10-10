import React from 'react';
import './ProgressIndicator.css';

const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const steps = [
    { id: 1, label: 'Услуга', icon: 'S', tooltip: 'Выберите услугу' },
    { id: 2, label: 'Мастер', icon: 'M', tooltip: 'Выберите мастера' },
    { id: 3, label: 'Дата', icon: 'D', tooltip: 'Выберите дату' },
    { id: 4, label: 'Время', icon: 'T', tooltip: 'Выберите время' },
    { id: 5, label: 'Запись', icon: 'B', tooltip: 'Подтвердите запись' }
  ];

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="progress-indicator">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="progress-steps">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`progress-step ${index + 1 <= currentStep ? 'completed' : ''} ${index + 1 === currentStep ? 'current' : ''}`}
            title={step.tooltip}
          >
            <div className="step-icon">
              {index + 1 < currentStep ? '✓' : step.icon}
            </div>
            <span className="step-label">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
