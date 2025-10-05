import React, { useState } from 'react';
import QRCodeLanding from './components/QRCodeLanding';
import BookingPage from './components/BookingPage';
import './App.css';

function App() {
  const [showBookingPage, setShowBookingPage] = useState(false);

  const handleBookWithoutRegistration = () => {
    setShowBookingPage(true);
  };

  if (showBookingPage) {
    return (
      <div className="App">
        <BookingPage />
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
