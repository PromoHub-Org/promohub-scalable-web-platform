import express from 'express';
import { 
  adminAddDeal, 
  adminUpdateDeal, 
  adminDeleteDeal, 
  adminGetClaims, 
  adminGetStats 
} from '../controllers/adminController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Enforce Admin authorization on all admin endpoints
router.use(verifyToken, requireAdmin);

router.post('/deals', adminAddDeal);
router.put('/deals/:id', adminUpdateDeal);
router.delete('/deals/:id', adminDeleteDeal);
router.get('/claims', adminGetClaims);
router.get('/stats', adminGetStats);

export default router;
