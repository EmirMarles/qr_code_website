import React, { useState, useEffect } from 'react';
import QRCodeLanding from './components/QRCodeLanding';
import BookingPage from './components/BookingPage';
import './App.css';

function App() {
  const [showBookingPage, setShowBookingPage] = useState(false);
  const [businessId, setBusinessId] = useState(null);

  useEffect(() => {
    // Check if URL contains businessId parameter (QR code scan)
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('businessId');
    
    if (id) {
      setBusinessId(id);
      // Automatically show booking page for QR code scans
      setShowBookingPage(true);
    }
  }, []);

  const handleBookWithoutRegistration = () => {
    setShowBookingPage(true);
  };

  if (showBookingPage) {
    return (
      <div className="App">
        <BookingPage businessId={businessId} />
      </div>
    );
  }

  return (
    <div className="App">
      <QRCodeLanding onBookWithoutRegistration={handleBookWithoutRegistration} />
    </div>
  );
}

export default App;
