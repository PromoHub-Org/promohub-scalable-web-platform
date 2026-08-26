import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'PromoHub Express Backend API',
    database: process.env.DATABASE_URL ? 'PostgreSQL' : 'SQLite (Local Dev Fallback)'
  });
});

export default router;
