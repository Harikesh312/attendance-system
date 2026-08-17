import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">QR Attendance</Link>
      </div>
      <div className="nav-links">
        {user ? (
          <>
            <Link 
              to={user.role === 'admin' ? '/admin/dashboard' : '/student/scan'} 
              style={{ color: 'var(--accent-primary)', fontWeight: 'bold', marginRight: '1rem' }}
            >
              Go to {user.role === 'admin' ? 'Admin Portal' : 'Student Portal'}
            </Link>
            <button className="btn btn-danger" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/">Home</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
