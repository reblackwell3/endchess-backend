import express from 'express';
import { createOrUpdateAuth, getAuthByProviderId } from './authController';

const router = express.Router();

// Route to create or update an auth record
router.post('/auth', createOrUpdateAuth);

// Route to get an auth record by providerId and provider
router.get('/auth/:provider/:providerId', getAuthByProviderId);

export default router;
