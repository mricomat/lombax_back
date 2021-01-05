import { NextFunction, Request, Response, Router } from "express";
import IUserModel, { User } from "../database/models/user.model";
import passport from "passport";
import { authentication } from "../utilities/authentication";

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


  passport.authenticate("local", { session: false }, (err, user, info) => {
    console.log(req.body);

    if (err) {
      return next(err);
    }

    if (user) {
      user.token = user.generateJWT();
      return res.json({ user: user.toAuthJSON() });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

export const AuthRouter: Router = router;
