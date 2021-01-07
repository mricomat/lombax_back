"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const mongoose_1 = require("mongoose");
const ImageSchema = new mongoose_1.Schema({
    name: {
        type: mongoose_1.Schema.Types.String,
        required: [true, "can't be blank"],
        index: true,
    },
    fileId: {
        type: mongoose_1.Schema.Types.String,
        required: [true, "can't be blank"],
        index: true,
    },
}, { timestamps: true });
exports.Image = mongoose_1.model("Image", ImageSchema);
//# sourceMappingURL=image.model.js.map