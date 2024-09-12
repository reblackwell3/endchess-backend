// backend/games/gameRoutes.ts
import express, { Request, Response } from 'express';
import controller from './gameController';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  controller.getGame(req, res);
});

export default router;
