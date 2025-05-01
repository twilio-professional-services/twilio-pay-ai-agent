import express, { Request, Response } from 'express';
import { handleJoinConferenceAction } from '../controllers/joinConference';
import { ImageResponseCardFilterSensitiveLog } from '@aws-sdk/client-lex-runtime-v2';

const router = express.Router();

router.post('/conference/:conferenceid', async (req: Request, res: Response) => {
  try {
    console.log('Join Conference', req.params.conferenceid);
    const response = await handleJoinConferenceAction(req.params.conferenceid);
    console.log('Join Conference Response', response);
    res.type('text/xml');
    res.status(200).send(response);
  } catch (error) {
    console.log('Join Conference Error', error);
    res.status(500).json({ error: 'Failed to process join conference' });
  }
});

export default router;