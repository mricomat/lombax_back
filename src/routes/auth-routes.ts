import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { authentication, validateToken } from "../utilities/authentication";
import IUserModel, { User } from "../database/models/user.model";
import upload from "../middleware/upload";
import IImageModel, { Image } from "../database/models/image.model";
import { ObjectId } from "mongodb";
import { GameFeel } from "../database/models/gameFeel.model";
import { Review } from "../database/models/review.model";

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

        const counts = await getUserCounts(user._id);

        const userJson = user.toAuthJSON();
        return res.json({ user: { ...userJson, counts } });
      } else {
        return res.status(422).json(info);
      }
    }
  )(req, res, next);
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

  const gamesCount = await GameFeel.aggregate()
    .match({ user: new ObjectId(id), gameStatus: { $ne: null } })
    .group({ _id: "$game.id", count: { $addToSet: "$game.id" } })
    .project({
      _id: 0,
      count: 1,
      size: {
        $size: "$count",
      },
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
    gamesCount: (gamesCount[0] && gamesCount[0].size) || 0,
  };
};

router.post(
  "/refreshToken",
  authentication.required,
  async (req: Request, res: Response, next: NextFunction) => {
    const resToken = validateToken(req);
    if (!resToken) {
      return res.status(422).json("info");
    }
    const counts = await getUserCounts(resToken.id);
    User.findById(resToken.id)
      .populate({
        path: "diary",
        populate: {
          path: "review",
          select: "game.imageId rating summary",
        },
        options: { sort: { createdAt: -1 }, limit: 15 },
      })
      .populate({
        path: "diary",
        populate: {
          path: "gameFeel",
          select: "game.imageId gameStatus like",
        },
        options: { sort: { createdAt: -1 }, limit: 15 },
      })
      .then((user: IUserModel) => {
        if (!user) {
          return res.status(404).json({ errors: "User doesn't found" });
        }
        user.token = user.generateJWT();

        const userJson = user.toAuthJSON();
        return res.json({ user: { ...userJson, counts } });
      })
      .catch(next);
  }
);

router
  .route("/register")
  .post(
    upload.array("file", 12),
    (req: Request, res: Response, next: NextFunction) => {
      const files = req.files as Express.Multer.File[];
      console.log(req.body);
      Image.find({
        $or: [{ name: files[0].filename }, { name: files[1].filename }],
      }).then(async (image) => {
        if (image.length > 0) {
          return res.status(200).json({
            success: false,
            message: "Image already exists",
          });
        }

        const imagesIdPromise = await files.map((f) => {
          let newImage = new Image({
            name: f.filename,
            fileId: f.id,
          });

          return newImage
            .save()
            .then((image) => {
              return image.name;
            })
            .catch(next);
        });

        const imagesId = await Promise.all(imagesIdPromise);

        return res.status(200).json({
          success: true,
          imagesId,
        });
      });
      // const user: IUserModel = new User();

      // user.name = req.body.name;
      // user.username = req.body.username;
      // user.email = req.body.email;
      // user.setPassword(req.body.password);
      // user.summary = req.body.summary;
      // user.coverId = req.body.coverId;
      // user.backgroundId = req.body.backgroundId;
      // user.interests = req.body.interests;
      // user.coverId = imagesId[0] || "";
      // user.backgroundId = imagesId[1] || "";

      // return user
      //   .save()
      //   .then(() => {
      //     console.log("user saved", user);
      //     return res.json({ user: user.toAuthJSON() });
      //   })
      //   .catch((error) => {
      //     console.log("user errr", error);
      //     return res.status(200).json({
      //       success: false,
      //       message: "Image already exists",
      //     });
      //     return next(error);
      //   });
    }
  );

export const AuthRoutes: Router = router;
