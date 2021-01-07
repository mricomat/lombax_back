import { NextFunction, Request, Response, Router } from "express";
import IUserModel, { User } from "../database/models/user.model";

import IDiaryModel, { Diary } from "../database/models/diary.model";
import IReviewModel, { Review } from "../database/models/review.model";
import { DiaryAction, DiaryType } from "../interfaces/diary-interface";
import { authentication } from "../utilities/authentication";

const router: Router = Router();

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
  }
);

export const ReviewRoutes: Router = router;
