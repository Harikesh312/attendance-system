import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Wait, I need to check if jwt-decode is installed. I didn't install it in my command! Let's write the context without it or use basic parsing.

// I will parse the JWT manually since it's just base64 for the payload, 
// to avoid another dependency install.

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, role, ...details }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    const studentToken = localStorage.getItem('student_token');

    if (adminToken) {
      const decoded = parseJwt(adminToken);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser({ role: 'admin', id: decoded.id });
      } else {
        localStorage.removeItem('admin_token');
      }
    } else if (studentToken) {
      const decoded = parseJwt(studentToken);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        // Here we could also fetch student profile, but we rely on local storage for now or API
        setUser({ role: 'student', id: decoded.id });
      } else {
        localStorage.removeItem('student_token');
      }
    }
    setLoading(false);
  }, []);

  const loginAdmin = (token, adminData) => {
    localStorage.setItem('admin_token', token);
    setUser({ role: 'admin', ...adminData });
  };

  const loginStudent = (token, studentData) => {
    localStorage.setItem('student_token', token);
    setUser({ role: 'student', ...studentData });
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('student_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginAdmin, loginStudent, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
