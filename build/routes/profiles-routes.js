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
exports.ProfilesRoutes = router;
//# sourceMappingURL=profiles-routes.js.map