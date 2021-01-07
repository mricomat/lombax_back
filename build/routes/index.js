"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainRouter = void 0;
const express_1 = require("express");
const users_routes_1 = require("./users-routes");
const upload_routes_1 = require("./upload-routes");
const images_routes_1 = require("./images-routes");
const auth_routes_1 = require("./auth-routes");
const reviews_routes_1 = require("./reviews-routes");
const router = express_1.Router();
router.use("/", users_routes_1.UsersRoutes);
router.use("/", upload_routes_1.UploadRoutes);
router.use("/", images_routes_1.ImagesRoutes);
router.use("/", auth_routes_1.AuthRoutes);
router.use("/", reviews_routes_1.ReviewRoutes);
exports.MainRouter = router;
//# sourceMappingURL=index.js.map