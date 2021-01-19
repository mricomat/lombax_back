import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { authentication, validateToken } from "../utilities/authentication";
import IUserModel, { User } from "../database/models/user.model";
import upload from "../middleware/upload";
import IImageModel, { Image } from "../database/models/image.model";
import { ObjectId } from "mongodb";

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
        const counts = await User.aggregate()
          .match({ _id: new ObjectId(user._id) })
          .project({
            _id: 0,
            reviewsCount: {
              $size: "$reviews",
            },
            diaryCount: {
              $size: "$diary",
            },
            gameFeelsCount: {
              $size: "$gameFeels",
            },
          });
        const userJson = user.toAuthJSON();
        return res.json({ user: { ...userJson, counts: counts[0] } });
      } else {
        return res.status(422).json(info);
      }
    }
  )(req, res, next);
});

router.post(
  "/refreshToken",
  authentication.required,
  async (req: Request, res: Response, next: NextFunction) => {
    const resToken = validateToken(req);
    if (!resToken) {
      return res.status(422).json("info");
    }
    const counts = await User.aggregate()
      .match({ _id: new ObjectId(resToken.id) })
      .project({
        _id: 0,
        reviewsCount: {
          $size: "$reviews",
        },
        diaryCount: {
          $size: "$diary",
        },
        gameFeelsCount: {
          $size: "$gameFeels",
        },
      });

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
        return res.json({ user: { ...userJson, counts: counts[0] } });
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
