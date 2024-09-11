import { Router, Request, Response } from 'express';
import { getMistakes } from './mistakesController';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  getMistakes(req, res);
});

export default router;
