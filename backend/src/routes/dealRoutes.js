import express from 'express';
import { getDeals, getSingleDeal, claimDeal } from '../controllers/dealController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getDeals);
router.get('/:id', getSingleDeal);
router.post('/:id/claim', verifyToken, claimDeal);

export default router;
