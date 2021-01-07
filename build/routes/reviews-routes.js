"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = require("express");
const user_model_1 = require("../database/models/user.model");
const diary_model_1 = require("../database/models/diary.model");
const review_model_1 = require("../database/models/review.model");
const diary_interface_1 = require("../interfaces/diary-interface");
const authentication_1 = require("../utilities/authentication");
const router = express_1.Router();
/**
 * POST /api/review
 */
router.post("/review", authentication_1.authentication.required, async (req, res, next) => {
    const review = new review_model_1.Review();
    const user = await user_model_1.User.findById(req.body.userId);
    if (!user) {
        next("Incorrect parameters");
    }
    review.user = req.body.userId;
    review.game.id = req.body.game.id;
    review.game.imageId = req.body.game.cover.image_id;
    review.game.releaseDate = req.body.game.first_release_date;
    review.game.name = req.body.game.name;
    review.summary = req.body.summary;
    review.rating = req.body.rating;
    review.dateFinished = req.body.dateFinished;
    review.timeToBeat = req.body.timeToBeat;
    return review
        .save()
        .then(() => {
        const diary = new diary_model_1.Diary();
        diary.user = review.user;
        diary.game = {
            id: review.game.id,
            imageId: review.game.imageId,
        };
        diary.review = review._id;
        diary.type = diary_interface_1.DiaryType.Review;
        diary.action = diary_interface_1.DiaryAction.Add;
        return diary
            .save()
            .then(async () => {
            await user.addReview(review._id);
            await user.addDiary(diary._id);
            return res.json({
                review: review.toJSON(),
                diary: diary.toJSON(),
            });
        })
            .catch(next);
    })
        .catch(next);
});
exports.ReviewRoutes = router;
//# sourceMappingURL=reviews-routes.js.map