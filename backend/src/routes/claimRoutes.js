import express from 'express';
import { getMyClaims } from '../controllers/claimController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/claims', verifyToken, getMyClaims);

export default router;
