import { NextFunction, Request, Response, Router } from "express";
import IUserModel, { User } from "../database/models/user.model";
import passport from "passport";
import { authentication } from "../utilities/authentication";
import { ObjectId } from "mongodb";
import { GameFeel } from "../database/models/gameFeel.model";
import { Review } from "../database/models/review.model";

const router: Router = Router();

/**
 * GET /api/user
 */
router.get("/user", (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.query.id)
    .populate({
      path: "diary",
      populate: {
        path: "review",
        select: "game.imageId rating summary",
      },
      options: { sort: { createdAt: -1 } },
    })
    .populate({
      path: "diary",
      populate: {
        path: "gameFeel",
        select: "game.imageId gameStatus like",
      },
      options: { sort: { createdAt: -1 } },
    })
    .then(async (user: IUserModel) => {
      const counts = await getUserCounts(user._id);
      const userJson = user.toAuthJSON();
      return res.json({ user: { ...userJson, counts } });
    })
    .catch(next);
});

const getUserCounts = async (id: string) => {
  const diaryCounts = await User.aggregate()
    .match({ _id: new ObjectId(id) })
    .project({
      _id: 0,
      count: {
        $size: "$diary",
      },
    });

  const reviewsCount = await Review.aggregate()
    .match({
      $and: [
        { summary: { $ne: "" } },
        { summary: { $exists: true } },
        { user: new ObjectId(id) },
      ],
    })
    .group({ _id: null, count: { $sum: 1 } })
    .project({
      _id: 0,
    });

  // TODO cambiar, pues pueden haber mas de un game stateus por juego
  const gamesCount = await GameFeel.aggregate()
    .match({ user: new ObjectId(id), gameStatus: { $ne: null } })
    .group({ _id: null, count: { $sum: 1 } })
    .project({
      _id: 0,
    });

  const likesCount = await GameFeel.aggregate()
    .match({ user: new ObjectId(id), like: true })
    .group({ _id: null, count: { $sum: 1 } })
    .project({
      _id: 0,
    });

  return {
    likesCount: (likesCount[0] && likesCount[0].count) || 0,
    diaryCounts: (diaryCounts[0] && diaryCounts[0].count) || 0,
    reviewsCount: (reviewsCount[0] && reviewsCount[0].count) || 0,
    gamesCount: (gamesCount[0] && gamesCount[0].count) || 0,
  };
};

router.get("/users", (req: Request, res: Response, next: NextFunction) => {
  User.find({
    $or: [
      { name: new RegExp("^" + req.query.search, "i") },
      { username: new RegExp("^" + req.query.search, "i") },
    ],
  })
    .select("name username coverId backgroundId")
    .limit(20)
    .then((users: IUserModel[]) => {
      res.status(200).json({ users });
    })
    .catch(next);
});

/**
 * PUT /api/user
 */
router.put(
  "/user",
  authentication.required,
  (req: Request, res: Response, next: NextFunction) => {
    User.findById(req.payload.id)
      .then((user: IUserModel) => {
        if (!user) {
          return res.sendStatus(401);
        }

        // Update only fields that have values:
        // ISSUE: DRY out code?
        if (typeof req.body.email !== "undefined") {
          user.email = req.body.user.email;
        }
        if (typeof req.body.username !== "undefined") {
          user.username = req.body.user.username;
        }
        if (typeof req.body.password !== "undefined") {
          user.setPassword(req.body.password);
        }
        // if (typeof req.body.user.image !== "undefined") {
        //   user.coverId = req.body.user.coverId;
        // }

        if (typeof req.body.favorites !== "undefined") {
          user.favorites = req.body.favorites;
        }

        if (typeof req.body.description !== "undefined") {
          user.description = req.body.description;
        }

        return user.save().then(() => {
          return res.json({ user: user.toAuthJSON() });
        });
      })
      .catch(next);
  }
);

/**
 * POST /api/users
 */
router.post("/users", (req: Request, res: Response, next: NextFunction) => {
  const user: IUserModel = new User();

  user.name = req.body.name;
  user.lastName = req.body.lastName;
  user.username = req.body.username;
  user.email = req.body.email;
  user.birth = req.body.birth;
  user.setPassword(req.body.password);
  user.description = req.body.description;
  user.coverId = req.body.coverId;
  user.backgroundId = req.body.backgroundId;
  user.interests = req.body.interests;

  return user
    .save()
    .then(() => {
      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

// ISSUE: How does this work with the trailing (req, res, next)?
/**
 * POST /api/users/login
 */
router.post(
  "/users/login",
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.user.email) {
      return res.status(422).json({ errors: { email: "Can't be blank" } });
    }

    if (!req.body.user.password) {
      return res.status(422).json({ errors: { password: "Can't be blank" } });
    }

    passport.authenticate("local", { session: false }, (err, user, info) => {
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
  }
);

/**
 * POST /api/users/registerCheck
 */
router.post(
  "/users/registerCheck",
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.email) {
      return res.status(422).json({ errors: { email: "Can't be blank" } });
    }
    if (!req.body.username) {
      return res.status(422).json({ errors: { email: "Can't be blank" } });
    }

    const user: IUserModel = new User();

    user.username = req.body.username;
    user.email = req.body.email;

    User.find({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    })
      .then((result) => {
        if (result.length > 0) {
          return res.json({
            isValid: false,
            username: result[0].username === req.body.username,
            email: result[0].email === req.body.email,
          });
        } else {
          return res.json({ isValid: true });
        }
      })
      .catch((error) => {
        if (error.status === 404) {
          return res.json({ isValid: true });
        }
        next(error);
      });
  }
);

export const UsersRoutes: Router = router;
