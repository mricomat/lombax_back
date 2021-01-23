import { NextFunction, Request, Response, Router } from "express";

import IDiaryModel, { Diary } from "../database/models/diary.model";
import { DiaryAction, DiaryType } from "../interfaces/diary-interface";
import IGameFeel, { GameFeel } from "../database/models/gameFeel.model";
import { authentication } from "../utilities/authentication";
import IUserModel, { User } from "../database/models/user.model";
import { IGame } from "../interfaces/game-interface";
import { GameStatus } from "../interfaces/diary-interface";

const router: Router = Router();

/**
 * POST /api/gameFeel
 */
router.post(
  "/gameFeel",
  authentication.required,
  async (req: Request, res: Response, next: NextFunction) => {
    const user: IUserModel = await User.findById(req.body.userId);

    if (!user) {
      next("Incorrect parameters");
    }

    const findFeel = await GameFeel.findOne({
      user: req.body.userId,
      "game.id": req.body.game.id,
    });

    const gameFeel: IGameFeel = new GameFeel();

    const game: IGame = {
      id: req.body.game.id,
      imageId: req.body.game.cover.image_id,
      backgroundId: req.body.game.screenshots[0].image_id,
      releaseDate: req.body.game.first_release_date,
      name: req.body.game.name,
    };

    gameFeel.user = req.body.userId;
    gameFeel.game = game;
    gameFeel.gameStatus = req.body.gameStatus;

    // If we pass from completed game to want to play or playing
    if (
      findFeel &&
      findFeel.gameStatus !== GameStatus.Playing &&
      findFeel.gameStatus !== GameStatus.WantPlay &&
      (gameFeel.gameStatus === GameStatus.Playing ||
        gameFeel.gameStatus === GameStatus.WantPlay)
    ) {
      gameFeel.replaying = true;
    }

    return gameFeel
      .save()
      .then(async () => {
        if (req.body.record) {
          const diary: IDiaryModel = new Diary();
          diary.user = gameFeel.user;
          diary.game = game;
          diary.gameFeel = gameFeel._id;
          diary.type = DiaryType.GameFeel;
          diary.action = DiaryAction.Add;

          return diary
            .save()
            .then(async () => {
              if (findFeel) {
                await user.removeGameFeel(findFeel._id);
              }
              await user.addGameFeel(gameFeel._id);

              await user.addDiary(diary._id);
              return res.json({
                gameFeel: gameFeel.toJSON(),
                diary: diary.toJSON(),
              });
            })
            .catch(next);
        } else {
          if (findFeel) {
            await user.removeGameFeel(findFeel._id);
          }
          await user.addGameFeel(gameFeel._id);

          return res.json({
            gameFeel: gameFeel.toJSON(),
          });
        }
      })
      .catch(next);
  }
);

export const GameFeelRoutes: Router = router;
