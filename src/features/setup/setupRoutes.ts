import express from 'express';
import { setup } from './setupController';

const router = express.Router();

router.post('/setup', setup);

export default router;
