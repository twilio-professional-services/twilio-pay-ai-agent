import express, { Request, Response } from "express";
import { handleJoinConferenceAction } from "../controllers/joinConference";
import logger from "../utils/logger";

const router = express.Router();

router.post(
  "/conference/:conferenceid",
  async (req: Request, res: Response) => {
    try {
      logger.info("Join Conference", { conferenceId: req.params.conferenceid });
      const response = await handleJoinConferenceAction(
        req.params.conferenceid
      );
      logger.info("Join Conference Response", { response });
      res.type("text/xml");
      res.status(200).send(response);
    } catch (error) {
      logger.error("Join Conference Error", { error });
      res.status(500).json({ error: "Failed to process join conference" });
    }
  }
);

export default router;
