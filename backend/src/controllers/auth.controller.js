const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_dev_key', {
    expiresIn: '30d',
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Server error during authentication' });
  }
};

const registerUser = async (req, res) => {
  const { name, email, password, adminSecret } = req.body;
  const providedSecret = req.headers['x-admin-secret'] || adminSecret;

  // Strict check: Prevent unauthorized public admin registration
  const expectedSecret = process.env.ADMIN_REGISTRATION_SECRET;
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return res.status(403).json({ 
      message: 'Registration is restricted. A valid admin registration secret is required.' 
    });
  }

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: 'admin',
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  return res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};

module.exports = { loginUser, registerUser, getMe };
