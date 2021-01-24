"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiaryRoutes = void 0;
const express_1 = require("express");
const diary_model_1 = require("../database/models/diary.model");
const router = express_1.Router();
/**
 * GET /api/user/diary
 */
router.get("/user/diary", (req, res, next) => {
    const offset = typeof req.query.offset === "string" ? req.query.offset : undefined;
    diary_model_1.Diary.find({ user: req.query.id })
        .sort({ createdAt: -1 })
        .skip(parseInt(offset))
        .limit(10)
        .populate("review")
        .populate("gameFeel")
        .then((diaries) => {
        res.status(200).json({
            diaries,
            count: diaries.length,
            offset: parseInt(offset),
        });
    })
        .catch(next);
});
exports.DiaryRoutes = router;
//# sourceMappingURL=diary-route.js.map