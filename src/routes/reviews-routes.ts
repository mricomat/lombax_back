import { NextFunction, Request, Response, Router } from "express";

import IUserModel, { User } from "../database/models/user.model";
import IDiaryModel, { Diary } from "../database/models/diary.model";
import IReviewModel, { Review } from "../database/models/review.model";
import IGameFeel, { GameFeel } from "../database/models/gameFeel.model";
import { DiaryAction, DiaryType } from "../interfaces/diary-interface";
import { IGame } from "../interfaces/game-interface";
import { authentication } from "../utilities/authentication";
import { GameStatus } from "../interfaces/diary-interface";

const router: Router = Router();

/**
 * GET /api/review/user
 */
router.get(
  "/review/user",
  authentication.required,
  (req: Request, res: Response, next: NextFunction) => {
    Review.find({ user: req.params.id })
      //.populate("user", "name coverId")
      .then((reviews: IReviewModel[]) => {
        res.status(200).json({ reviews: reviews });
      })
      .catch(next);
  }
);

/**
 * GET /api/review/game/user
 */
router.get(
  "/review/user/game",
  authentication.required,
  (req: Request, res: Response, next: NextFunction) => {
    Review.find({ user: req.query.userId, "game.id": req.query.gameId })
      // .populate("user", "name coverId")
      .then((reviews: IReviewModel[]) => {
        res.status(200).json({ reviews: reviews });
      })
      .catch(next);
  }
);

/**
 * GET /api/review
 */
router.get(
  "/reviews/user",
  (req: Request, res: Response, next: NextFunction) => {
    const offset =
      typeof req.query.offset === "string" ? req.query.offset : undefined;
    Review.find({ user: req.query.id, summary: { $ne: "" } })
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(10)
      .populate("user", "name username coverId")
      .then((reviews: IReviewModel[]) => {
        res.status(200).json({
          reviews: reviews,
          count: reviews.length,
          offset: parseInt(offset),
        });
      })
      .catch(next);
  }
);

/**
 * POST /api/review
 */
router.post(
  "/review",
  authentication.required,
  async (req: Request, res: Response, next: NextFunction) => {
    const review: IReviewModel = new Review();

    const user: IUserModel = await User.findById(req.body.userId);

    if (!user) {
      next("Incorrect parameters");
    }

    const game: IGame = {
      id: req.body.game.id,
      imageId: req.body.game.cover.image_id,
      backgroundId: req.body.game.screenshots[0].image_id,
      releaseDate: req.body.game.first_release_date,
      name: req.body.game.name,
    };

    review.user = req.body.userId;
    review.game = game;
    review.summary = req.body.summary;
    review.rating = req.body.rating;
    review.dateFinished = req.body.dateFinished;
    review.timeToBeat = req.body.timeToBeat;

    const gameFeel: IGameFeel = new GameFeel();

    const findFeel = await GameFeel.findOne({
      user: req.body.userId,
      "game.id": req.body.game.id,
    });

    gameFeel.user = req.body.userId;
    gameFeel.game = game;
    gameFeel.gameStatus = req.body.gameStatus || "BEATEN";

    // If we pass from completed game to want to play or playing
    if (
      findFeel.gameStatus !== GameStatus.Playing &&
      findFeel.gameStatus !== GameStatus.WantPlay &&
      (gameFeel.gameStatus === GameStatus.Playing ||
        gameFeel.gameStatus === GameStatus.WantPlay)
    ) {
      gameFeel.replaying = true;
    }

    const resGameFeel = await gameFeel.save();

    if (req.body.record) {
      return review
        .save()
        .then(() => {
          const diary: IDiaryModel = new Diary();
          diary.user = review.user;
          diary.game = game;
          diary.review = review._id;
          diary.type = DiaryType.Review;
          diary.action = DiaryAction.Add;

          return diary
            .save()
            .then(async () => {
              if (findFeel) {
                await user.removeGameFeel(findFeel._id);
              }
              await user.addReview(review._id);
              await user.addDiary(diary._id);
              await user.addGameFeel(gameFeel._id);
              return res.json({
                review: review.toJSON(),
                diary: diary.toJSON(),
                gameFeel: gameFeel.toJSON(),
              });
            })
            .catch(next);
        })
        .catch(next);
    } else {
      // TODO remove all reviews with the userId, that are not inside user.reviews except this review.
      return review
        .save()
        .then(async () => {
          if (findFeel) {
            await user.removeGameFeel(findFeel._id);
          }
          await user.addGameFeel(gameFeel._id);
          return res.json({
            review: review.toJSON(),
            gameFeel: resGameFeel.toJSON(),
          });
        })
        .catch(next);
    }
  }
);

/**
 * PUT /api/review/game
 */
router.put(
  "/review",
  authentication.required,
  async (req: Request, res: Response, next: NextFunction) => {
    Review.findById(req.body.id)
      .then((review: IReviewModel) => {
        if (!review) {
          return res.sendStatus(404);
        }
        if (typeof req.body.rating !== "undefined") {
          review.rating = req.body.rating;
        }

        return review.save().then(() => {
          return res.json({ review: review.toJSON() });
        });
      })
      .catch(next);
  }
);

export const ReviewRoutes: Router = router;
