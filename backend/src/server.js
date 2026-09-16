import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import dealRoutes from './routes/dealRoutes.js';
import claimRoutes from './routes/claimRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import healthRoute from './routes/healthRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Flexible CORS configuration for local development and cloud previews
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, mobile, curl, or same-origin requests (origin undefined)
    if (!origin) return callback(null, true);
    // Allow any localhost port, 127.0.0.1, or vercel preview domains
    if (
      origin.startsWith('http://localhost:') || 
      origin.startsWith('http://127.0.0.1:') ||
      origin.endsWith('.vercel.app') ||
      process.env.CLIENT_ORIGIN === '*' ||
      origin === process.env.CLIENT_ORIGIN
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Welcome Route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Welcome to PromoHub Express REST API Backend',
    version: '1.0.0',
    documentation: {
      health: '/health',
      deals: '/api/deals',
      auth: '/api/auth/login'
    }
  });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/me', claimRoutes);
app.use('/api/admin', adminRoutes);
app.use('/health', healthRoute);

// Default 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Endpoint ${req.originalUrl} not found on PromoHub Backend.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 PromoHub Express REST API Server running on http://localhost:${PORT}`);
  console.log(`🏥 Health Check Status Endpoint: http://localhost:${PORT}/health`);
});
