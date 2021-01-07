"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const mongoose_1 = require("mongoose");
// ISSUE: Own every parameter and any missing dependencies
const GameSchema = new mongoose_1.Schema({
    gameId: {
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
}, { timestamps: false });
exports.Game = mongoose_1.model("Game", GameSchema);
//# sourceMappingURL=game.model.js.map