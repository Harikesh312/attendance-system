import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import QRDisplay from '../../components/QRDisplay';
import RecordsTable from '../../components/RecordsTable';

const AdminDashboard = () => {
  const [qrData, setQrData] = useState(null);
  const [records, setRecords] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    fetchRecords();
    const interval = setInterval(() => {
      if (qrData || selectedSessionId) {
        fetchRecords();
      }
    }, 10000); // Polling every 10 seconds

    return () => clearInterval(interval);
  }, [qrData, selectedSessionId]);

  const fetchSessions = async () => {
    try {
      const res = await axiosInstance.get('/admin/sessions');
      setSessions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecords = async () => {
    try {
      const query = selectedSessionId ? `?sessionId=${selectedSessionId}` : '';
      const res = await axiosInstance.get(`/admin/records${query}`);
      setRecords(res.data.records);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateQR = async () => {
    setLoading(true);
    setError('');
    try {
      const title = prompt('Enter a title for this session (e.g., Math 101):', 'Class Session');
      if (title === null) return; // cancelled

      const res = await axiosInstance.post('/admin/generate-qr', { title });
      setQrData(res.data);
      setSelectedSessionId(res.data.sessionId);
      fetchSessions(); // refresh session list
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate QR');
    } finally {
      setLoading(false);
    }
  };

  const handleStopSession = async () => {
    if (!qrData || !qrData.sessionId) return;
    setLoading(true);
    setError('');
    try {
      await axiosInstance.post(`/admin/stop-session/${qrData.sessionId}`);
      setQrData(null);
      fetchSessions();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to stop session');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const query = selectedSessionId ? `?sessionId=${selectedSessionId}` : '';
      const response = await axiosInstance.get(`/admin/records/download${query}`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'attendance.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download CSV');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2>Admin Dashboard</h2>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={handleGenerateQR} disabled={loading}>
          {loading && !qrData ? 'Generating...' : 'Generate New QR Code'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {qrData && (
        <div className="card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h3>Active Session QR</h3>
          <QRDisplay qrImage={qrData.qrImage} expiresAt={qrData.expiresAt} />
          <button 
            className="btn btn-danger" 
            style={{ marginTop: '1.5rem', width: 'auto', minWidth: '150px' }} 
            onClick={handleStopSession} 
            disabled={loading}
          >
            {loading ? 'Stopping...' : 'Stop Session'}
          </button>
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3>Attendance Records</h3>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
            <select 
              className="form-control" 
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              style={{ flex: '1 1 200px' }}
            >
              <option value="">All Sessions</option>
              {sessions.map(s => (
                <option key={s.sessionId} value={s.sessionId}>
                  {s.title} ({new Date(s.createdAt).toLocaleDateString()})
                </option>
              ))}
            </select>
            <button className="btn" style={{ flex: '1 1 150px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }} onClick={handleDownloadCSV}>
              Download CSV
            </button>
          </div>
        </div>
        
        <RecordsTable records={records} />
      </div>
    </div>
  );
};

export default AdminDashboard;
