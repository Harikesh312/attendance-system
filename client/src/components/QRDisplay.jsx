import React, { useState, useEffect } from 'react';

const QRDisplay = ({ qrImage, expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!expiresAt) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(expiresAt).getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft('Expired');
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  if (!qrImage) return null;

  return (
    <div className="qr-container">
      <div className="qr-image">
        <img src={qrImage} alt="Session QR Code" style={{ width: '300px', height: '300px' }} />
      </div>
      <div className={`alert ${timeLeft === 'Expired' ? 'alert-error' : 'alert-success'}`} style={{ marginTop: '1rem' }}>
        Status: {timeLeft === 'Expired' ? 'QR Code Expired' : `Expires in ${timeLeft}`}
      </div>
    </div>
  );
};

export default QRDisplay;
