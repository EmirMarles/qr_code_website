import React from 'react';
import './Loading.css';

const Loading = ({ message = "Загрузка..." }) => {
  return (
    <div className="loading-container">
      <div className="hourglassBackground">
        <div className="hourglassContainer">
          <div className="hourglassCurves"></div>
          <div className="hourglassCapTop"></div>
          <div className="hourglassGlassTop"></div>
          <div className="hourglassSand"></div>
          <div className="hourglassSandStream"></div>
          <div className="hourglassCapBottom"></div>
          <div className="hourglassGlass"></div>
        </div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default Loading;
