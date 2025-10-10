import React, { useState, useEffect } from 'react';
import QRCodeLanding from './components/QRCodeLanding';
import BusinessLanding from './components/BusinessLanding';
import BookingPage from './components/BookingPage';
import NotFound from './components/NotFound';
import './App.css';

function App() {
  const [showBookingPage, setShowBookingPage] = useState(false);
  const [showBusinessLanding, setShowBusinessLanding] = useState(false);
  const [businessId, setBusinessId] = useState(null);

  useEffect(() => {
    // Check if URL contains businessId parameter (QR code scan)
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('businessId');
    const qr = urlParams.get('qr');
    const direct = urlParams.get('direct');
    
    if (id) {
      setBusinessId(id);
      // If direct=true or no QR parameter, show booking page directly
      // If QR parameter exists and direct=false, show QR landing page for app redirection
      if (direct === 'true' || !qr) {
        setShowBookingPage(true); // Show booking page directly
      } else {
        setShowBookingPage(false); // Show QR landing page
      }
    } else {
      // No businessId found, show 404 page
      setShowBookingPage(false);
    }
  }, []);

  const handleBookWithoutRegistration = () => {
    // Show business landing page first
    setShowBusinessLanding(true);
  };

  const handleStartBooking = () => {
    // Add direct parameter to URL to ensure booking page shows directly
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('direct', 'true');
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
    setShowBusinessLanding(false);
    setShowBookingPage(true);
  };

  if (showBookingPage) {
    return (
      <div className="App">
        <BookingPage businessId={businessId} />
      </div>
    );
  }

  if (showBusinessLanding) {
    return (
      <div className="App">
        <BusinessLanding businessId={businessId} onStartBooking={handleStartBooking} />
      </div>
    );
  }

  // If no businessId is provided, show 404 page
  if (!businessId) {
    return (
      <div className="App">
        <NotFound />
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
