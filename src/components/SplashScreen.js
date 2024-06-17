import React from 'react';

const SplashScreen = ({ setShowSplash }) => (
  <div className="splash-screen" onClick={() => setShowSplash(false)}>
    <div className="splash-content">
      <img src="exeter.jpg" alt="Exeter University Background" id="splash-uni"/>
      <img src="logomast.png" alt="Splash Background" className="splash-image" />
      <h2 className="splash-text">Tap to Continue</h2>
    </div>
  </div>
);

export default SplashScreen;
