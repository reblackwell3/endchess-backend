import express, { Request, Response } from 'express';
import { analyzeGameEndpoint } from './analyzeController';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  analyzeGameEndpoint(req, res);
});

export default router;
