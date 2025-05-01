import express, { Request, Response } from 'express';
import { handleStatusCallback } from '../controllers/statusCallbackController';

const router = express.Router();

router.post('/status-callback', async (req: Request, res: Response) => {
  try {
    await handleStatusCallback(req.body);
    res.type('text/xml');
    // console.log('Incoming call', callDetails);
    res.sendStatus(200); //.send(callDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process callback' });
  }
});

export default router;
