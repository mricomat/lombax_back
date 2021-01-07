import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { authentication, validateToken } from "../utilities/authentication";
import IUserModel, { User } from "../database/models/user.model";

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
    async (err, user: IUserModel, info) => {
      if (err) {
        return next(err);
      }
      if (user) {
        user.token = user.generateJWT();
        return res.json({ user: user.toAuthJSON() });
      } else {
        return res.status(422).json(info);
      }
    }
  )(req, res, next);
});

router.post(
  "/refreshToken",
  authentication.required,
  (req: Request, res: Response, next: NextFunction) => {
    const resToken = validateToken(req);
    if (!resToken) {
      return res.status(422).json("info");
    }
    User.findById(resToken.id)
      .populate({
        path: "diary",
        populate: {
          path: "review",
          select: "game.imageId rating",
        },
      })
      .then((user: IUserModel) => {
        if (!user) {
          return res.status(404).json({ errors: "User doesn't found" });
        }
        user.token = user.generateJWT();

        return res.json({ user: user.toAuthJSON() });
      })
      .catch(next);
  }
);

// const buildUser = (user: IUserModel): IUserModel => {
//   user.token = user.generateJWT();
//   const addInfo = await user.getAditionalInfo(user._id, next);

// };

export const AuthRoutes: Router = router;
