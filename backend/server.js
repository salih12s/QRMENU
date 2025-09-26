const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
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