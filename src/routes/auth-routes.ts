import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";

const router: Router = Router();

/**
 * POST /api/users
 */
router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.email) {
    return res.status(422).json({ errors: { email: "Can't be blank" } });
  }

  if (!req.body.password) {
    return res.status(422).json({ errors: { password: "Can't be blank" } });
  }

  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (user) {
        user.token = user.generateJWT();
        const addInfo = await user.getAditionalInfo(user._id, next);
        user.reviewsCount = addInfo.reviewsCount;
        user.gamesPlayed = addInfo.gamesPlayed;
        user.diary = await user.getRecentActivity(user._id, next);
        return res.json({ user: user.toAuthJSON() });
      } else {
        return res.status(422).json(info);
      }
    }
  )(req, res, next);
});

export const AuthRoutes: Router = router;
