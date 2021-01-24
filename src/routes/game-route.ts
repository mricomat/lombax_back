import { NextFunction, Request, Response, Router } from "express";

import IReviewModel, { Review } from "../database/models/review.model";
import IGameFeel, { GameFeel } from "../database/models/gameFeel.model";
import { authentication } from "../utilities/authentication";
import { ObjectId } from "mongodb";

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

/**
 * GET /api/game
 */
router.get("/games/user", (req: Request, res: Response, next: NextFunction) => {
  const offset =
    typeof req.query.offset === "string" ? req.query.offset : undefined;
  const id = typeof req.query.id === "string" ? req.query.id : undefined;

  // GameFeel.aggregate()
  //   .match({
  //     user: new ObjectId(id),
  //     gameStatus: { $ne: null },
  //   })
  //   .unwind("game")
  //   .group({ _id: "$gameFeel", count: { $addToSet: "$game.id" } })
  //   .sort({ createdAt: -1 })
  //   .limit(20)
  //   .skip(parseInt(offset))
  //   .then((gameFeels) => {
  //     res
  //       .status(200)
  //       .json({ gameFeels, count: gameFeels.length, offset: parseInt(offset) });
  //   })
  //   .catch(next);

  GameFeel.find({
    user: req.query.id,
    gameStatus: { $ne: null },
  })
    .distinct("game.id")
    .sort({ createdAt: -1 })
    .skip(parseInt(offset))
    .then((gameFeels: IGameFeel[]) => {
      res
        .status(200)
        .json({ gameFeels, count: gameFeels.length, offset: parseInt(offset) });
    })
    .catch(next);
});

export const GamesRoutes: Router = router;
