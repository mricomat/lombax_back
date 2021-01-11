"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadRoutes = void 0;
const express_1 = require("express");
const upload_1 = __importDefault(require("../middleware/upload"));
const image_model_1 = require("../database/models/image.model");
const router = express_1.Router();
/**
 * GET /api/upload
 */
router.get("/upload", (req, res, next) => {
    return res.json({ test: "test" });
});
/**
 * POST /api/upload
 */
router
    .route("/upload")
    .post(upload_1.default.single("file"), (req, res, next) => {
    image_model_1.Image.findOne({ name: req.file.id })
        .then((image) => {
        if (image) {
            return res.status(200).json({
                success: false,
                message: "Image already exists",
            });
        }
        let newImage = new image_model_1.Image({
            name: req.file.filename,
            fileId: req.file.id,
        });
        newImage
            .save()
            .then((image) => {
            return res.status(200).json({
                success: true,
                image,
            });
        })
            .catch((err) => res.status(500).json(err));
    })
        .catch((err) => res.status(500).json(err));
});
/**
 * POST /api/upload
 */
router
    .route("/multipleUpload")
    .post(upload_1.default.array("file", 3), (req, res, next) => {
    console.log(req.body);
    const files = req.files;
    image_model_1.Image.find({
        $or: [{ name: files[0].filename }, { name: files[1].filename }],
    }).then(async (image) => {
        if (image.length > 0) {
            return res.status(200).json({
                success: false,
                message: "Image already exists",
            });
        }
        const imagesIdPromise = await files.map((f) => {
            let newImage = new image_model_1.Image({
                name: f.filename,
                fileId: f.id,
            });
            return newImage
                .save()
                .then((image) => {
                return image.name;
            })
                .catch(next);
        });
        const imagesId = await Promise.all(imagesIdPromise);
        return res.status(200).json({
            success: true,
            imagesId,
        });
    });
});
exports.UploadRoutes = router;
//# sourceMappingURL=upload-routes.js.map