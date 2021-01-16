import { NextFunction, Request, Response, Router } from "express";

import IUserModel, { User } from "../database/models/user.model";
import IDiaryModel, { Diary } from "../database/models/diary.model";
import IReviewModel, { Review } from "../database/models/review.model";
import { DiaryAction, DiaryType } from "../interfaces/diary-interface";
import { authentication } from "../utilities/authentication";

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
    console.log(req.query, req.params);
    Review.find({ user: req.query.userId, "game.id": req.query.gameId })
      // .populate("user", "name coverId")
      .then((reviews: IReviewModel[]) => {
        res.status(200).json({ reviews: reviews });
      })
      .catch(next);
  }
);

// /**
//  * GET /api/review
//  */
// router.get(
//   "/review/game",
//   authentication.required,
//   (req: Request, res: Response, next: NextFunction) => {
//     Review.find({ "user._id": req.params.id })
//       //.populate("user", "name coverId")
//       .then((reviews: IReviewModel[]) => {
//         res.status(200).json({ reviews: reviews });
//       })
//       .catch(next);
//   }
// );

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

    review.user = req.body.userId;
    review.game.id = req.body.game.id;
    review.game.imageId = req.body.game.cover.image_id;
    review.game.releaseDate = req.body.game.first_release_date;
    review.game.name = req.body.game.name;
    review.summary = req.body.summary;
    review.rating = req.body.rating;
    review.dateFinished = req.body.dateFinished;
    review.timeToBeat = req.body.timeToBeat;

    if (req.body.record) {
      return review
        .save()
        .then(() => {
          const diary: IDiaryModel = new Diary();
          diary.user = review.user;
          diary.game = {
            id: review.game.id,
            imageId: review.game.imageId,
          };
          diary.review = review._id;
          diary.type = DiaryType.Review;
          diary.action = DiaryAction.Add;

          return diary
            .save()
            .then(async () => {
              await user.addReview(review._id);
              await user.addDiary(diary._id);
              return res.json({
                review: review.toJSON(),
                diary: diary.toJSON(),
              });
            })
            .catch(next);
        })
        .catch(next);
    } else {
      return review
        .save()
        .then(() => {
          return res.json({
            review: review.toJSON(),
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
