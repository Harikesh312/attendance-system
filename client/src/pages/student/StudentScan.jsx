import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axiosInstance from '../../api/axiosInstance';
import RecordsTable from '../../components/RecordsTable';

const StudentScan = () => {
  const [scanResult, setScanResult] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (isScanning) {
      const scanner = new Html5QrcodeScanner('reader', {
        qrbox: { width: 250, height: 250 },
        fps: 10,
      });

      scanner.render(onScanSuccess, onScanError);

      function onScanSuccess(decodedText) {
        scanner.clear();
        setIsScanning(false);
        handleAttendance(decodedText);
      }

      function onScanError(err) {
        // Ignored, happens constantly as it scans
      }

      return () => {
        scanner.clear().catch(error => {
          console.error('Failed to clear scanner', error);
        });
      };
    }
  }, [isScanning]);

  const fetchHistory = async () => {
    try {
      const res = await axiosInstance.get('/student/history');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAttendance = async (qrDataString) => {
    setError('');
    setScanResult('');
    try {
      // QR payload is expected to be { "sessionId": "..." }
      const data = JSON.parse(qrDataString);
      if (!data.sessionId) throw new Error('Invalid QR Format');

      const res = await axiosInstance.post('/student/scan', { sessionId: data.sessionId });
      setScanResult(res.data.message || 'Attendance Marked Successfully!');
      fetchHistory(); // Refresh history
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to mark attendance');
    }
  };

  const handleScanAgain = () => {
    setScanResult('');
    setError('');
    setIsScanning(true);
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Mark Attendance</h2>
      
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', marginBottom: '2rem' }}>
        {error && <div className="alert alert-error">{error}</div>}
        {scanResult && <div className="alert alert-success">{scanResult}</div>}
        
        {isScanning ? (
          <div className="qr-container">
            <div id="reader"></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
              Point your camera at the QR code displayed by the admin.
            </p>
            <button className="btn btn-danger" onClick={() => setIsScanning(false)} style={{ marginTop: '1rem', maxWidth: '200px' }}>
              Stop Scanner
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <button className="btn btn-primary" onClick={handleScanAgain} style={{ maxWidth: '200px' }}>
              {scanResult || error ? 'Scan Another Code' : 'Start Scanner'}
            </button>
          </div>
        )}
      </div>

      <div className="card">
        <h3>My Attendance History</h3>
        <RecordsTable records={history} />
      </div>
    </div>
  );
};

export default StudentScan;
