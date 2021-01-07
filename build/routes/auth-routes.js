"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const authentication_1 = require("../utilities/authentication");
const user_model_1 = require("../database/models/user.model");
const router = express_1.Router();
/**
 * POST /api/users
 */
router.post("/login", (req, res, next) => {
    if (!req.body.email) {
        return res.status(422).json({ errors: { email: "Can't be blank" } });
    }
    if (!req.body.password) {
        return res.status(422).json({ errors: { password: "Can't be blank" } });
    }
    passport_1.default.authenticate("local", { session: false }, async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (user) {
            user.token = user.generateJWT();
            return res.json({ user: user.toAuthJSON() });
        }
        else {
            return res.status(422).json(info);
        }
    })(req, res, next);
});
router.post("/refreshToken", authentication_1.authentication.required, (req, res, next) => {
    const resToken = authentication_1.validateToken(req);
    if (!resToken) {
        return res.status(422).json("info");
    }
    user_model_1.User.findById(resToken.id)
        .populate({
        path: "diary",
        populate: {
            path: "review",
            select: "game.imageId rating",
        },
    })
        .then((user) => {
        if (!user) {
            return res.status(404).json({ errors: "User doesn't found" });
        }
        user.token = user.generateJWT();
        return res.json({ user: user.toAuthJSON() });
    })
        .catch(next);
});
// const buildUser = (user: IUserModel): IUserModel => {
//   user.token = user.generateJWT();
//   const addInfo = await user.getAditionalInfo(user._id, next);
// };
exports.AuthRoutes = router;
//# sourceMappingURL=auth-routes.js.map