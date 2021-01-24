"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Diary = void 0;
const mongoose_1 = require("mongoose");
const DiarySchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        unique: false,
        required: [true, "can't be blank"],
        index: true,
    },
    game: {
        id: {
            type: mongoose_1.Schema.Types.Number,
            unique: false,
            required: [true, "can't be blank"],
        },
        imageId: {
            type: mongoose_1.Schema.Types.String,
            unique: false,
            required: [true, "can't be blank"],
        },
        backgroundId: {
            type: mongoose_1.Schema.Types.String,
            unique: false,
            required: [true, "can't be blank"],
        },
        releaseDate: {
            type: mongoose_1.Schema.Types.Number,
            unique: false,
            required: [true, "can't be blank"],
        },
        name: {
            type: mongoose_1.Schema.Types.String,
            unique: false,
            required: [true, "can't be blank"],
        },
    },
    review: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Review",
    },
    gameFeel: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "GameFeel",
    },
    type: {
        type: mongoose_1.Schema.Types.String,
    },
    action: {
        type: mongoose_1.Schema.Types.String,
    },
}, { timestamps: true });
exports.Diary = mongoose_1.model("Diary", DiarySchema);
//# sourceMappingURL=diary.model.js.map