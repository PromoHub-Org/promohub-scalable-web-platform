import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'promohub_super_secret_jwt_key_2026';

// Middleware to verify JWT authentication token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Missing or invalid authentication token.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
  }
};

// Middleware to enforce Admin authorization
export const requireAdmin = (req, res, next) => {
  if (!req.user || (!req.user.is_admin && req.user.is_admin !== 1)) {
    return res.status(403).json({ error: 'Forbidden. Administrator permissions required.' });
  }
  next();
};
