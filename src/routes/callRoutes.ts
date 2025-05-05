import express, { Request, Response } from "express";
import { handleIncomingCall } from "../controllers/callController";
import logger from "../utils/logger";

const router = express.Router();

router.post("/incoming-call", async (req: Request, res: Response) => {
  try {
    const callDetails = await handleIncomingCall(req.body);
    res.type("text/xml");
    logger.info("Incoming call", { callDetails });
    res.status(200).send(callDetails);
  } catch (error) {
    res.status(500).json({ error: "Failed to process incoming call" });
  }
});

export default router;
