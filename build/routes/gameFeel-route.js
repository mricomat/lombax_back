"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameFeelRoutes = void 0;
const express_1 = require("express");
const diary_model_1 = require("../database/models/diary.model");
const diary_interface_1 = require("../interfaces/diary-interface");
const gameFeel_model_1 = require("../database/models/gameFeel.model");
const authentication_1 = require("../utilities/authentication");
const user_model_1 = require("../database/models/user.model");
const diary_interface_2 = require("../interfaces/diary-interface");
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
    const gameFeel = new gameFeel_model_1.GameFeel();
    const game = {
        id: req.body.game.id,
        imageId: req.body.game.cover.image_id,
        backgroundId: req.body.game.screenshots[0].image_id,
        releaseDate: req.body.game.first_release_date,
        name: req.body.game.name,
    };
    gameFeel.user = req.body.userId;
    gameFeel.game = game;
    gameFeel.gameStatus = req.body.gameStatus;
    // If we pass from completed game to want to play or playing
    if (findFeel &&
        findFeel.gameStatus !== diary_interface_2.GameStatus.Playing &&
        findFeel.gameStatus !== diary_interface_2.GameStatus.WantPlay &&
        (gameFeel.gameStatus === diary_interface_2.GameStatus.Playing ||
            gameFeel.gameStatus === diary_interface_2.GameStatus.WantPlay)) {
        gameFeel.replaying = true;
    }
    return gameFeel
        .save()
        .then(async () => {
        if (req.body.record) {
            const diary = new diary_model_1.Diary();
            diary.user = gameFeel.user;
            diary.game = game;
            diary.gameFeel = gameFeel._id;
            diary.type = diary_interface_1.DiaryType.GameFeel;
            diary.action = diary_interface_1.DiaryAction.Add;
            return diary
                .save()
                .then(async () => {
                if (findFeel) {
                    await user.removeGameFeel(findFeel._id);
                }
                await user.addGameFeel(gameFeel._id);
                await user.addDiary(diary._id);
                return res.json({
                    gameFeel: gameFeel.toJSON(),
                    diary: diary.toJSON(),
                });
            })
                .catch(next);
        }
        else {
            if (findFeel) {
                await user.removeGameFeel(findFeel._id);
            }
            await user.addGameFeel(gameFeel._id);
            return res.json({
                gameFeel: gameFeel.toJSON(),
            });
        }
    })
        .catch(next);
});
exports.GameFeelRoutes = router;
//# sourceMappingURL=gameFeel-route.js.map