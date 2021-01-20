"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesRoutes = void 0;
const express_1 = require("express");
const user_model_1 = require("../database/models/user.model");
const authentication_1 = require("../utilities/authentication");
const router = express_1.Router();
/**
 * POST /api/profiles/:username/follow
 */
router.post("/follow", authentication_1.authentication.required, (req, res, next) => {
    user_model_1.User.findById(req.body.id)
        .then((user) => {
        return user.follow(req.body.followId).then(() => {
            user_model_1.User.findById(req.body.followId)
                .then((userFollow) => {
                userFollow.follower(user._id).then(() => {
                    return res.json({ userFollow: userFollow._id });
                });
            })
                .catch(next);
        });
    })
        .catch(next);
});
/**
 * POST /api/profiles/:username/unfollow
 */
router.post("/unfollow", authentication_1.authentication.required, (req, res, next) => {
    user_model_1.User.findById(req.body.id)
        .then((user) => {
        return user.unfollow(req.body.followId).then(() => {
            user_model_1.User.findById(req.body.followId)
                .then((userFollow) => {
                userFollow.unfollower(user._id).then(() => {
                    return res.json({ userUnfollow: userFollow._id });
                });
            })
                .catch(next);
        });
    })
        .catch(next);
});
/**
 * POST /api/following
 */
router.get("/following", (req, res, next) => {
    const offset = typeof req.query.offset === "string" ? req.query.offset : undefined;
    user_model_1.User.findById(req.query.id)
        .select("following")
        .populate({
        path: "following",
        select: "name username coverId",
        sort: { createdAt: -1 },
        limit: 10,
        skip: parseInt(offset),
    })
        .then((user) => {
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
router.get("/followers", (req, res, next) => {
    const offset = typeof req.query.offset === "string" ? req.query.offset : undefined;
    user_model_1.User.findById(req.query.id)
        .select("followers")
        .populate({
        path: "followers",
        select: "name username coverId",
        sort: { createdAt: -1 },
        limit: 10,
        skip: parseInt(offset),
    })
        .then((user) => {
        return res.status(200).json({
            followers: user.followers,
            count: user.followers.length,
            offset: parseInt(offset),
        });
    })
        .catch(next);
});
exports.ProfilesRoutes = router;
//# sourceMappingURL=profiles-routes.js.map