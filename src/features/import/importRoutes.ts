import express, { Request, Response } from 'express';
import { importGames } from './importController';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  importGames(req, res);
});

export default router;
