import React from 'react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-icon">🔍</div>
        <h1>404</h1>
        <h2>Business Not Found</h2>
        <p>The business you're looking for doesn't exist or the QR code is invalid.</p>
        
        <div className="not-found-actions">
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
        
        <div className="not-found-help">
          <h3>Need Help?</h3>
          <p>If you're trying to book an appointment, please scan the QR code provided by the business.</p>
          <p>Make sure you're scanning the correct QR code for this business.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
