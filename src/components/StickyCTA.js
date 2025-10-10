import React from 'react';
import './StickyCTA.css';

const StickyCTA = ({ 
  currentStep, 
  totalSteps, 
  onContinue, 
  canContinue, 
  buttonText = "Продолжить",
  isLoading = false 
}) => {
  if (currentStep >= totalSteps) {
    return null; // Hide on final step
  }

  return (
    <div className="sticky-cta">
      <div className="cta-content">
        <div className="progress-info">
          <span className="step-indicator">
            Шаг {currentStep} из {totalSteps}
          </span>
        </div>
        <button 
          className={`cta-button ${!canContinue ? 'disabled' : ''} ${isLoading ? 'loading' : ''}`}
          onClick={onContinue}
          disabled={!canContinue || isLoading}
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              Загрузка...
            </>
          ) : (
            <>
              {buttonText}
              <span className="cta-arrow">→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StickyCTA;
