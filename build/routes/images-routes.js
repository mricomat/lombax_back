"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagesRoutes = void 0;
const express_1 = require("express");
const index_1 = require("../database/index");
const router = express_1.Router();
/**
 * GET /api/user
 */
router.get("/images/:filename", (req, res, next) => {
    index_1.gfs
        .find({ filename: req.params.filename })
        .toArray((err, files) => {
        if (!files[0] || files.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No files available",
                files,
            });
        }
        if (files[0].contentType === "image/jpeg" ||
            files[0].contentType === "image/png" ||
            files[0].contentType === "image/svg+xml") {
            // render image to browser
            index_1.gfs.openDownloadStreamByName(req.params.filename).pipe(res);
        }
        else {
            res.status(404).json({
                err: "Not an image",
            });
        }
    });
});
exports.ImagesRoutes = router;
//# sourceMappingURL=images-routes.js.map