import React, { useEffect, useState } from 'react';
import BookingPage from './components/BookingPage';
import DesktopRedirect from './components/DesktopRedirect';
import './App.css';

function App() {
  const [showRedirect, setShowRedirect] = useState(false);
  const [redirectComplete, setRedirectComplete] = useState(false);

  useEffect(() => {
    // Check if user is on desktop
    const isDesktop = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isDesktop && !redirectComplete) {
      setShowRedirect(true);
    }
  }, [redirectComplete]);

  const handleRedirectComplete = () => {
    setShowRedirect(false);
    setRedirectComplete(true);
  };

  if (showRedirect) {
    return (
      <div className="App">
        <DesktopRedirect onRedirectComplete={handleRedirectComplete} />
      </div>
    );
  }

  return (
    <div className="App">
      <BookingPage />
    </div>
  );
}

export default App;
