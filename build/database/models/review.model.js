"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
// ISSUE: Own every parameter and any missing dependencies
const ReviewSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "can't be blank"],
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
    summary: {
        type: mongoose_1.Schema.Types.String,
    },
    rating: {
        type: mongoose_1.Schema.Types.Number,
    },
    dateFinished: {
        type: mongoose_1.Schema.Types.String,
    },
    timeToBeat: {
        type: mongoose_1.Schema.Types.String,
    },
}, { timestamps: true });
ReviewSchema.plugin(mongoose_paginate_1.default);
exports.Review = mongoose_1.model("Review", ReviewSchema);
//# sourceMappingURL=review.model.js.map