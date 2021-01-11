import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { authentication, validateToken } from "../utilities/authentication";
import IUserModel, { User } from "../database/models/user.model";
import upload from "../middleware/upload";
import IImageModel, { Image } from "../database/models/image.model";

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

router
  .route("/register")
  .post(
    upload.array("file", 3),
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

        const user: IUserModel = new User();

        user.name = req.body.name;
        user.username = req.body.username;
        user.email = req.body.email;
        user.setPassword(req.body.password);
        user.summary = req.body.summary;
        user.coverId = req.body.coverId;
        user.backgroundId = req.body.backgroundId;
        user.interests = req.body.interests;
        user.coverId = imagesId[0] || "";
        user.backgroundId = imagesId[1] || "";

        console.log("user", user);
        return user
          .save()
          .then(() => {
            return res.json({ user: user.toAuthJSON() });
          })
          .catch(next);
      });
    }
  );

export const AuthRoutes: Router = router;
