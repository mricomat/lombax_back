"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameFeelRoutes = void 0;
const express_1 = require("express");
const diary_model_1 = require("../database/models/diary.model");
const diary_interface_1 = require("../interfaces/diary-interface");
const gameFeel_model_1 = require("../database/models/gameFeel.model");
const authentication_1 = require("../utilities/authentication");
const user_model_1 = require("../database/models/user.model");
const router = express_1.Router();
/**
 * POST /api/gameFeel
 */
router.post("/gameFeel", authentication_1.authentication.required, async (req, res, next) => {
    const user = await user_model_1.User.findById(req.body.userId);
    if (!user) {
        next("Incorrect parameters");
    }
    const findFeel = await gameFeel_model_1.GameFeel.findOne({
        user: req.body.userId,
        "game.id": req.body.game.id,
    });
    if (findFeel) {
        const gameFeel = new gameFeel_model_1.GameFeel();
        gameFeel.user = req.body.userId;
        gameFeel.game.id = req.body.game.id;
        gameFeel.game.imageId = req.body.game.cover.image_id;
        gameFeel.game.releaseDate = req.body.game.first_release_date;
        gameFeel.game.name = req.body.game.name;
        gameFeel.gameStatus = req.body.gameStatus;
        gameFeel.like = req.body.like;
        return gameFeel
            .save()
            .then(() => {
            const diary = new diary_model_1.Diary();
            diary.user = gameFeel.user;
            diary.game = {
                id: gameFeel.game.id,
                imageId: gameFeel.game.imageId,
            };
            diary.gameFeel = gameFeel._id;
            diary.type = diary_interface_1.DiaryType.GameFeel;
            diary.action = diary_interface_1.DiaryAction.Add;
            return diary
                .save()
                .then(async () => {
                await user.addGameFeel(gameFeel._id);
                await user.addDiary(diary._id);
                return res.json({
                    gameFeel: gameFeel.toJSON(),
                    diary: diary.toJSON(),
                });
            })
                .catch(next);
        })
            .catch(next);
    }
    else {
        findFeel.gameStatus = req.body.gameStatus;
        findFeel.like = req.body.like;
        return findFeel.save().then(() => {
            return res.json({ gameFeel: findFeel.toJSON() });
        });
    }
});
exports.GameFeelRoutes = router;
//# sourceMappingURL=gameFeel-route.js.map