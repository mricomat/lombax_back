"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesRoutes = void 0;
const express_1 = require("express");
const review_model_1 = require("../database/models/review.model");
const gameFeel_model_1 = require("../database/models/gameFeel.model");
const authentication_1 = require("../utilities/authentication");
const router = express_1.Router();
/**
 * GET /api/game
 */
router.get("/game", authentication_1.authentication.required, (req, res, next) => {
    review_model_1.Review.find({ user: req.query.userId, "game.id": req.query.gameId })
        .sort({ createdAt: -1 })
        .then((reviews) => {
        gameFeel_model_1.GameFeel.findOne({
            user: req.query.userId,
            "game.id": req.query.gameId,
        })
            .sort({ createdAt: -1 })
            .then((gameFeel) => {
            res.status(200).json({ reviews: reviews, gameFeel });
        })
            .catch(next);
    })
        .catch(next);
});
/**
 * GET /api/game
 */
router.get("/games/user", (req, res, next) => {
    const offset = typeof req.query.offset === "string" ? req.query.offset : undefined;
    const id = typeof req.query.id === "string" ? req.query.id : undefined;
    // GameFeel.aggregate()
    //   .match({
    //     user: new ObjectId(id),
    //     gameStatus: { $ne: null },
    //   })
    //   .unwind("game")
    //   .group({ _id: "$gameFeel", count: { $addToSet: "$game.id" } })
    //   .sort({ createdAt: -1 })
    //   .limit(20)
    //   .skip(parseInt(offset))
    //   .then((gameFeels) => {
    //     res
    //       .status(200)
    //       .json({ gameFeels, count: gameFeels.length, offset: parseInt(offset) });
    //   })
    //   .catch(next);
    gameFeel_model_1.GameFeel.find({
        user: req.query.id,
        gameStatus: { $ne: null },
    })
        .distinct("game.id")
        .sort({ createdAt: -1 })
        .skip(parseInt(offset))
        .then((gameFeels) => {
        res
            .status(200)
            .json({ gameFeels, count: gameFeels.length, offset: parseInt(offset) });
    })
        .catch(next);
});
exports.GamesRoutes = router;
//# sourceMappingURL=game-route.js.map