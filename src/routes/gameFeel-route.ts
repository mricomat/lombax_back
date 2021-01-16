import { NextFunction, Request, Response, Router } from "express";

import IDiaryModel, { Diary } from "../database/models/diary.model";
import { DiaryAction, DiaryType } from "../interfaces/diary-interface";
import IGameFeel, { GameFeel } from "../database/models/gameFeel.model";
import { authentication } from "../utilities/authentication";
import IUserModel, { User } from "../database/models/user.model";

const router: Router = Router();

/**
 * POST /api/gameFeel
 */
router.post(
  "/gameFeel",
  authentication.required,
  async (req: Request, res: Response, next: NextFunction) => {
    const gameFeel: IGameFeel = new GameFeel();

    const user: IUserModel = await User.findById(req.body.userId);

    if (!user) {
      next("Incorrect parameters");
    }

    gameFeel.user = req.body.userId;
    gameFeel.game.id = req.body.game.id;
    gameFeel.game.imageId = req.body.game.cover.image_id;
    gameFeel.game.releaseDate = req.body.game.first_release_date;
    gameFeel.game.name = req.body.game.name;
    gameFeel.gameStatus = req.body.gameStatus;
    gameFeel.like = req.body.like;

    return gameFeel
      .save()
      .then(() => {
        const diary: IDiaryModel = new Diary();
        diary.user = gameFeel.user;
        diary.game = {
          id: gameFeel.game.id,
          imageId: gameFeel.game.imageId,
        };
        diary.gameFeel = gameFeel._id;
        diary.type = DiaryType.GameFeel;
        diary.action = DiaryAction.Add;

        return diary
          .save()
          .then(async () => {
            await user.addGameFeel(gameFeel._id);
            await user.addDiary(diary._id);
            return res.json({
              gameFeel: gameFeel.toJSON(),
              diary: diary.toJSON(),
            });
          })
          .catch(next);
      })
      .catch(next);
  }
);

export const GameFeelRoutes: Router = router;
