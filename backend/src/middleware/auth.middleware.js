const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_dev_key');
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User belonging to this token no longer exists' });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('JWT Verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no bearer token provided' });
};

module.exports = { protect };
