"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = require("express");
const user_model_1 = require("../database/models/user.model");
const diary_model_1 = require("../database/models/diary.model");
const review_model_1 = require("../database/models/review.model");
const gameFeel_model_1 = require("../database/models/gameFeel.model");
const diary_interface_1 = require("../interfaces/diary-interface");
const authentication_1 = require("../utilities/authentication");
const diary_interface_2 = require("../interfaces/diary-interface");
const router = express_1.Router();
/**
 * GET /api/review/user
 */
router.get("/review/user", authentication_1.authentication.required, (req, res, next) => {
    review_model_1.Review.find({ user: req.params.id })
        //.populate("user", "name coverId")
        .then((reviews) => {
        res.status(200).json({ reviews: reviews });
    })
        .catch(next);
});
/**
 * GET /api/review/game/user
 */
router.get("/review/user/game", authentication_1.authentication.required, (req, res, next) => {
    review_model_1.Review.find({ user: req.query.userId, "game.id": req.query.gameId })
        // .populate("user", "name coverId")
        .then((reviews) => {
        res.status(200).json({ reviews: reviews });
    })
        .catch(next);
});
/**
 * GET /api/review
 */
router.get("/reviews/user", (req, res, next) => {
    const offset = typeof req.query.offset === "string" ? req.query.offset : undefined;
    review_model_1.Review.find({ user: req.query.id, summary: { $ne: "" } })
        .sort({ createdAt: -1 })
        .skip(parseInt(offset))
        .limit(10)
        .populate("user", "name username coverId")
        .then((reviews) => {
        res.status(200).json({
            reviews: reviews,
            count: reviews.length,
            offset: parseInt(offset),
        });
    })
        .catch(next);
});
/**
 * POST /api/review
 */
router.post("/review", authentication_1.authentication.required, async (req, res, next) => {
    const review = new review_model_1.Review();
    const user = await user_model_1.User.findById(req.body.userId);
    if (!user) {
        next("Incorrect parameters");
    }
    const game = {
        id: req.body.game.id,
        imageId: req.body.game.cover.image_id,
        backgroundId: req.body.game.screenshots[0].image_id,
        releaseDate: req.body.game.first_release_date,
        name: req.body.game.name,
    };
    review.user = req.body.userId;
    review.game = game;
    review.summary = req.body.summary;
    review.rating = req.body.rating;
    review.dateFinished = req.body.dateFinished;
    review.timeToBeat = req.body.timeToBeat;
    const gameFeel = new gameFeel_model_1.GameFeel();
    const findFeel = await gameFeel_model_1.GameFeel.findOne({
        user: req.body.userId,
        "game.id": req.body.game.id,
    });
    gameFeel.user = req.body.userId;
    gameFeel.game = game;
    gameFeel.gameStatus = req.body.gameStatus || "BEATEN";
    // If we pass from completed game to want to play or playing
    if (findFeel &&
        findFeel.gameStatus !== diary_interface_2.GameStatus.Playing &&
        findFeel.gameStatus !== diary_interface_2.GameStatus.WantPlay &&
        (gameFeel.gameStatus === diary_interface_2.GameStatus.Playing ||
            gameFeel.gameStatus === diary_interface_2.GameStatus.WantPlay)) {
        gameFeel.replaying = true;
    }
    const resGameFeel = await gameFeel.save();
    if (req.body.record) {
        return review
            .save()
            .then(() => {
            const diary = new diary_model_1.Diary();
            diary.user = review.user;
            diary.game = game;
            diary.review = review._id;
            diary.type = diary_interface_1.DiaryType.Review;
            diary.action = diary_interface_1.DiaryAction.Add;
            return diary
                .save()
                .then(async () => {
                if (findFeel) {
                    await user.removeGameFeel(findFeel._id);
                }
                await user.addReview(review._id);
                await user.addDiary(diary._id);
                await user.addGameFeel(gameFeel._id);
                return res.json({
                    review: review.toJSON(),
                    diary: diary.toJSON(),
                    gameFeel: gameFeel.toJSON(),
                });
            })
                .catch(next);
        })
            .catch(next);
    }
    else {
        const reviewsToDelete = await review_model_1.Review.find({
            user: req.body.userId,
            "game.id": game.id,
            _id: { $nin: [...user.reviews] },
        });
        await Promise.all(reviewsToDelete.map(async (item) => {
            await item.remove();
        }));
        return review
            .save()
            .then(async () => {
            if (findFeel) {
                await user.removeGameFeel(findFeel._id);
            }
            await user.addGameFeel(gameFeel._id);
            return res.json({
                review: review.toJSON(),
                gameFeel: resGameFeel.toJSON(),
            });
        })
            .catch(next);
    }
});
/**
 * PUT /api/review/game
 */
router.put("/review", authentication_1.authentication.required, async (req, res, next) => {
    review_model_1.Review.findById(req.body.id)
        .then((review) => {
        if (!review) {
            return res.sendStatus(404);
        }
        if (typeof req.body.rating !== "undefined") {
            review.rating = req.body.rating;
        }
        return review.save().then(() => {
            return res.json({ review: review.toJSON() });
        });
    })
        .catch(next);
});
exports.ReviewRoutes = router;
//# sourceMappingURL=reviews-routes.js.map