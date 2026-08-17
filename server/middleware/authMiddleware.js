const jwt = require('jsonwebtoken');

const verifyToken = (role) => {
  return (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ error: 'Not authorized to access this route' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if the user has the required role
      if (role && decoded.role !== role) {
        return res.status(403).json({ error: `User role ${decoded.role} is not authorized` });
      }
      
      req.user = decoded; // { id, role }
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token is invalid or expired' });
    }
  };
};

module.exports = { verifyToken };
