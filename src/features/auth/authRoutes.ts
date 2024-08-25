import express from 'express';
import {
  createOrUpdateAuth,
  getAuthByProviderId,
  getAuthByPlayerId,
} from './authController';

const router = express.Router();

// Route to create or update an auth record
router.post('/auth', createOrUpdateAuth);

// Route to get an auth record by providerId and provider
router.get('/auth/:provider/:providerId', getAuthByProviderId);

// Route to get all auth records for a specific player
router.get('/auth/player/:playerId', getAuthByPlayerId);

export default router;
