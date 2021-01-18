import { NextFunction, Request, Response, Router } from "express";

import IReviewModel, { Review } from "../database/models/review.model";
import IGameFeel, { GameFeel } from "../database/models/gameFeel.model";
import { authentication } from "../utilities/authentication";

const router: Router = Router();

/**
 * GET /api/game
 */
router.get(
  "/game",
  authentication.required,
  (req: Request, res: Response, next: NextFunction) => {
    Review.find({ user: req.query.userId, "game.id": req.query.gameId })
      .sort({ createdAt: -1 })
      .then((reviews: IReviewModel[]) => {
        GameFeel.findOne({
          user: req.query.userId,
          "game.id": req.query.gameId,
        })
          .sort({ createdAt: -1 })
          .then((gameFeel: IGameFeel) => {
            res.status(200).json({ reviews: reviews, gameFeel });
          })
          .catch(next);
      })
      .catch(next);
  }
);

export const GamesRoutes: Router = router;
