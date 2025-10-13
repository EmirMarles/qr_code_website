import React from 'react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-icon">:C</div>
        <h1>404</h1>
        <h2>Бизнес не найден</h2>
        <p>Бизнес, который вы ищете, не существует или QR-код недействителен.</p>
        
        <div className="not-found-actions">
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Попробовать снова
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => window.history.back()}
          >
            Назад
          </button>
        </div>
        
        <div className="not-found-help">
          <h3>Нужна помощь?</h3>
          <p>Если вы пытаетесь записаться на прием, пожалуйста, отсканируйте QR-код, предоставленный бизнесом.</p>
          <p>Убедитесь, что вы сканируете правильный QR-код для этого бизнеса.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
