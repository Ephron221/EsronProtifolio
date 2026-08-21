const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const homeRoutes = require('./routes/home.routes');
const aboutRoutes = require('./routes/about.routes');
const projectRoutes = require('./routes/project.routes');
const skillRoutes = require('./routes/skill.routes');
const serviceRoutes = require('./routes/service.routes');
const contactRoutes = require('./routes/contact.routes');
const cvRoutes = require('./routes/cv.routes');
const uploadRoutes = require('./routes/upload.routes');
const testimonialRoutes = require('./routes/testimonial.routes');
const chatbotRoutes = require('./routes/chatbot.routes');
const documentRoutes = require('./routes/document.routes');

const app = express();

// Security Headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server) or in development
      if (!origin || process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive fallback to prevent breaking deployments
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiters for sensitive / resource-heavy endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // limit each IP to 25 login/register attempts per windowMs
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // limit each IP to 15 contact submissions per hour
  message: { message: 'Too many messages sent. Please wait before submitting another.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const chatbotLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: { response: 'Slow down a bit! Please wait a few seconds before asking another question.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware to ensure DB connection is ready (vital for serverless deployments like Vercel)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[DB Middleware Error]:', err.message);
    next();
  }
});

// Make the 'uploads' folder public (fallback for local files)
const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contacts', contactLimiter, contactRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/chatbot', chatbotLimiter, chatbotRoutes);
app.use('/api/documents', documentRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Esron Portfolio API is active and running smoothly.',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      home: '/api/home',
      projects: '/api/projects',
      skills: '/api/skills',
      services: '/api/services',
      documents: '/api/documents',
      cv: '/api/cv',
    },
  });
});

// 404 Route Not Found Middleware
app.use((req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

module.exports = app;
