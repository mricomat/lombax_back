"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameFeel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const GameFeelSchema = new mongoose_1.Schema({
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
    },
    played: {
        type: mongoose_1.Schema.Types.Boolean,
    },
    like: {
        type: mongoose_1.Schema.Types.Boolean,
    },
}, { timestamps: true });
GameFeelSchema.plugin(mongoose_paginate_1.default);
exports.GameFeel = mongoose_1.model("GameFeel", GameFeelSchema);
//# sourceMappingURL=gameFeel.model.js.map