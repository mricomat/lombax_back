import { NextFunction, Request, Response, Router } from "express";

import IDiaryModel, { Diary } from "../database/models/diary.model";

const router: Router = Router();

/**
 * GET /api/user/diary
 */
router.get("/user/diary", (req: Request, res: Response, next: NextFunction) => {
  const offset =
    typeof req.query.offset === "string" ? req.query.offset : undefined;
  Diary.find({ user: req.query.id })
    .sort({ createdAt: -1 })
    .skip(parseInt(offset))
    .limit(10)
    .populate("review")
    .populate("gameFeel")
    .then((diaries: IDiaryModel[]) => {
      res.status(200).json({
        diaries,
        count: diaries.length,
        offset: parseInt(offset),
      });
    })
    .catch(next);
});

export const DiaryRoutes: Router = router;
