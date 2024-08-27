// backend/features/tokens/tokenRoutes.ts
import express from 'express';
import { generateEmailToken, generateGoogleToken } from './tokenController';

const router = express.Router();

// Route to generate a token for email-based authentication
router.post('/token-email', generateEmailToken);

// Route to generate a token for Google-based authentication
router.post('/token-google', generateGoogleToken);

export default router;
