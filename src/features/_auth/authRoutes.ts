import express, { Request, Response } from 'express';
const router = express.Router();

// Route to get an auth record by providerId and provider
router.post('/auth', (req: Request, res: Response) => {
  const token = (req as any).decodedToken;
  res.status(!!token ? 200 : 403);
});

export default router;
