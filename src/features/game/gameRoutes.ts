// backend/games/gameRoutes.ts
import express, { Request, Response } from 'express';
import controller from './gameController';

const router = express.Router();

router.get('/', controller.getGame);

export default router;
