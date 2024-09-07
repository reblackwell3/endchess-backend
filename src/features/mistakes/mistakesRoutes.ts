import { Request, Response, Router } from 'express';
import connectAndPublish from './importProducer';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    connectAndPublish(
      req.body.otherPlatform,
      req.body.otherUsername,
      req.body.providerId,
    );
    res.status(200).json({ message: 'Import produced successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to produce import' });
  }
});

export default router;
