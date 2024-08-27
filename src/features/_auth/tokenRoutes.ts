// backend/features/tokens/tokenRoutes.ts
import express from 'express';
import { generateEmailToken } from './tokenController';

const router = express.Router();

// Route to generate a token for email-based authentication
router.post('/token-email', generateEmailToken);

export default router;
