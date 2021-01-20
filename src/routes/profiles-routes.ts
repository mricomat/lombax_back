import { NextFunction, Request, Response, Router } from "express";
import IUserModel, { User } from "../database/models/user.model";
import { authentication } from "../utilities/authentication";

const router: Router = Router();

/**
 * POST /api/profiles/:username/follow
 */
router.post(
  "/follow",
  authentication.required,
  (req: Request, res: Response, next: NextFunction) => {
    User.findById(req.body.id)
      .then((user: IUserModel) => {
        return user.follow(req.body.followId).then(() => {
          User.findById(req.body.followId)
            .then((userFollow: IUserModel) => {
              userFollow.follower(user._id).then(() => {
                return res.json({ userFollow: userFollow._id });
              });
            })
            .catch(next);
        });
      })
      .catch(next);
  }
);

/**
 * POST /api/profiles/:username/unfollow
 */
router.post(
  "/unfollow",
  authentication.required,
  (req: Request, res: Response, next: NextFunction) => {
    User.findById(req.body.id)
      .then((user: IUserModel) => {
        return user.unfollow(req.body.followId).then(() => {
          User.findById(req.body.followId)
            .then((userFollow: IUserModel) => {
              userFollow.unfollower(user._id).then(() => {
                return res.json({ userUnfollow: userFollow._id });
              });
            })
            .catch(next);
        });
      })
      .catch(next);
  }
);

/**
 * POST /api/following
 */
router.get("/following", (req: Request, res: Response, next: NextFunction) => {
  const offset =
    typeof req.query.offset === "string" ? req.query.offset : undefined;
  User.findById(req.query.id)
    .sort({ createdAt: -1 })
    .skip(parseInt(offset))
    .limit(10)
    .select("following")
    .populate("following", "name username coverId")
    .then((user: IUserModel) => {
      return res.status(200).json({
        following: user.following,
        count: user.following.length,
        offset: parseInt(offset),
      });
    })
    .catch(next);
});

/**
 * POST /api/following
 */
router.get("/followers", (req: Request, res: Response, next: NextFunction) => {
  const offset =
    typeof req.query.offset === "string" ? req.query.offset : undefined;
  User.findById(req.query.id)
    .sort({ createdAt: -1 })
    .skip(parseInt(offset))
    .limit(10)
    .select("followers")
    .populate("followers", "name username coverId")
    .then((user: IUserModel) => {
      return res.status(200).json({
        followers: user.followers,
        count: user.followers.length,
        offset: parseInt(offset),
      });
    })
    .catch(next);
});

export const ProfilesRoutes: Router = router;
