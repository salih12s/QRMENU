const express = require('express');
const cors = require('cors');
const path = require('path');

// Production için environment variables yükle
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: '.env.production' });
} else {
  require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 5000;

// Debug environment variables
console.log('Environment Debug:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://menuben.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend build files in production
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, 'public');
  app.use(express.static(frontendBuildPath));
  console.log('Serving frontend from:', frontendBuildPath);
}

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/restaurants', require('./src/routes/restaurants'));
app.use('/api/menu', require('./src/routes/menu'));
app.use('/api/reports', require('./src/routes/reports'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check endpoint hit');
  res.json({ 
    status: 'OK', 
    message: 'QR Menu Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Test login endpoint
app.post('/api/test-login', (req, res) => {
  console.log('Test login endpoint hit:', req.body);
  res.json({ 
    success: true, 
    message: 'Test endpoint working',
    received: req.body
  });
});

// Catch-all handler for frontend routes (SPA)
app.get('*', (req, res) => {
  // If it's an API request, return 404
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  
  // For frontend routes, serve index.html in production
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  } else {
    res.status(404).json({ message: 'Endpoint not found' });
  }
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`QR Menu Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});