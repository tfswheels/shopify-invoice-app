import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Invoice Generator API',
    version: '0.1.0',
    status: 'running',
    endpoints: {
      health: '/health',
      api: '/api',
      auth: '/auth/callback'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Invoice Generator API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes placeholder
app.get('/api', (req, res) => {
  res.json({
    message: 'Invoice Generator API',
    version: '0.1.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: ${process.env.APP_URL || `http://localhost:${PORT}`}`);
});

export default app;
