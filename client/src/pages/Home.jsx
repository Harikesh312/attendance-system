import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="auth-container">
      <div className="card" style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1>QR Attendance System</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', marginTop: '1rem' }}>
          Welcome to the MERN stack QR Code Attendance system. Please select your portal to continue.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/student/login" className="btn btn-primary" style={{ maxWidth: '200px' }}>
            Student Portal
          </Link>
          <Link to="/admin/login" className="btn" style={{ maxWidth: '200px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
