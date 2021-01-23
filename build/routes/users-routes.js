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
const mongodb_1 = require("mongodb");
const gameFeel_model_1 = require("../database/models/gameFeel.model");
const review_model_1 = require("../database/models/review.model");
const router = express_1.Router();
/**
 * GET /api/user
 */
router.get("/user", (req, res, next) => {
    user_model_1.User.findById(req.query.id)
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
        .then(async (user) => {
        const counts = await getUserCounts(user._id);
        const userJson = user.toAuthJSON();
        return res.json({ user: Object.assign(Object.assign({}, userJson), { counts }) });
    })
        .catch(next);
});
const getUserCounts = async (id) => {
    const diaryCounts = await user_model_1.User.aggregate()
        .match({ _id: new mongodb_1.ObjectId(id) })
        .project({
        _id: 0,
        count: {
            $size: "$diary",
        },
    });
    const reviewsCount = await review_model_1.Review.aggregate()
        .match({
        $and: [
            { summary: { $ne: "" } },
            { summary: { $exists: true } },
            { user: new mongodb_1.ObjectId(id) },
        ],
    })
        .group({ _id: null, count: { $sum: 1 } })
        .project({
        _id: 0,
    });
    const gamesCount = await gameFeel_model_1.GameFeel.aggregate()
        .match({ user: new mongodb_1.ObjectId(id), gameStatus: { $ne: null } })
        .group({ _id: "$game.id", count: { $addToSet: "$game.id" } })
        .project({
        _id: 0,
        count: 1,
        size: {
            $size: "$count",
        },
    });
    const likesCount = await gameFeel_model_1.GameFeel.aggregate()
        .match({ user: new mongodb_1.ObjectId(id), like: true })
        .group({ _id: null, count: { $sum: 1 } })
        .project({
        _id: 0,
    });
    return {
        likesCount: (likesCount[0] && likesCount[0].count) || 0,
        diaryCounts: (diaryCounts[0] && diaryCounts[0].count) || 0,
        reviewsCount: (reviewsCount[0] && reviewsCount[0].count) || 0,
        gamesCount: (gamesCount && gamesCount.length) || 0,
    };
};
router.get("/users", (req, res, next) => {
    user_model_1.User.find({
        $or: [
            { name: new RegExp("^" + req.query.search, "i") },
            { username: new RegExp("^" + req.query.search, "i") },
        ],
    })
        .select("name username coverId backgroundId")
        .limit(20)
        .then((users) => {
        res.status(200).json({ users });
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