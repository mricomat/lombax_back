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
        .then((reviews) => {
        gameFeel_model_1.GameFeel.findOne({
            user: req.query.userId,
            "game.id": req.query.gameId,
        })
            .sort({ createdAt: 1 })
            .then((gameFeel) => {
            res.status(200).json({ reviews: reviews, gameFeel });
        })
            .catch(next);
    })
        .catch(next);
});
exports.GamesRoutes = router;
//# sourceMappingURL=game-route.js.map