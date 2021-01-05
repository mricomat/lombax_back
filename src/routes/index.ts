import { Router } from "express";

import { UsersRoutes } from "./users-routes";
import { UploadRoutes } from "./upload-routes";
import { ImagesRoutes } from "./images-routes";
import { AuthRouter } from "./auth-routes";

const router: Router = Router();

router.use("/", UsersRoutes);
router.use("/", UploadRoutes);
router.use("/", ImagesRoutes);
router.use("/", AuthRouter);

export const MainRouter: Router = router;
