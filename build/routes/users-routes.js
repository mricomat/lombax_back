"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRoutes = void 0;
const express_1 = require("express");
const user_model_1 = require("../database/models/user.model");
const passport_1 = __importDefault(require("passport"));
const authentication_1 = require("../utilities/authentication");
const router = express_1.Router();
/**
 * GET /api/user
 */
router.get("/user", authentication_1.authentication.required, (req, res, next) => {
    user_model_1.User.findById(req.payload.id)
        .then((user) => {
        res.status(200).json({ user: user.toAuthJSON() });
    })
        .catch(next);
});
/**
 * PUT /api/user
 */
router.put("/user", authentication_1.authentication.required, (req, res, next) => {
    user_model_1.User.findById(req.payload.id)
        .then((user) => {
        if (!user) {
            return res.sendStatus(401);
        }
        // Update only fields that have values:
        // ISSUE: DRY out code?
        if (typeof req.body.user.email !== "undefined") {
            user.email = req.body.user.email;
        }
        if (typeof req.body.user.username !== "undefined") {
            user.username = req.body.user.username;
        }
        if (typeof req.body.user.password !== "undefined") {
            user.setPassword(req.body.user.password);
        }
        if (typeof req.body.user.image !== "undefined") {
            user.coverId = req.body.user.coverId;
        }
        if (typeof req.body.user.bio !== "undefined") {
            user.description = req.body.user.description;
        }
        return user.save().then(() => {
            return res.json({ user: user.toAuthJSON() });
        });
    })
        .catch(next);
});
/**
 * POST /api/users
 */
router.post("/users", (req, res, next) => {
    const user = new user_model_1.User();
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
router.post("/users/login", (req, res, next) => {
    if (!req.body.user.email) {
        return res.status(422).json({ errors: { email: "Can't be blank" } });
    }
    if (!req.body.user.password) {
        return res.status(422).json({ errors: { password: "Can't be blank" } });
    }
    passport_1.default.authenticate("local", { session: false }, (err, user, info) => {
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
/**
 * POST /api/users/registerCheck
 */
router.post("/users/registerCheck", (req, res, next) => {
    if (!req.body.email) {
        return res.status(422).json({ errors: { email: "Can't be blank" } });
    }
    if (!req.body.username) {
        return res.status(422).json({ errors: { email: "Can't be blank" } });
    }
    const user = new user_model_1.User();
    user.username = req.body.username;
    user.email = req.body.email;
    user_model_1.User.find({
        $or: [{ email: req.body.email }, { username: req.body.username }],
    })
        .then((result) => {
        if (result.length > 0) {
            return res.json({
                isValid: false,
                username: result[0].username === req.body.username,
                email: result[0].email === req.body.email,
            });
        }
        else {
            return res.json({ isValid: true });
        }
    })
        .catch((error) => {
        if (error.status === 404) {
            return res.json({ isValid: true });
        }
        next(error);
    });
});
exports.UsersRoutes = router;
//# sourceMappingURL=users-routes.js.map