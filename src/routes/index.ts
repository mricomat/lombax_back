import { Router } from "express";

import { UsersRoutes } from "./users-routes";
import { UploadRoutes } from "./upload-routes";
import { ImagesRoutes } from "./images-routes";
import { AuthRoutes } from "./auth-routes";
import { ReviewRoutes } from "./reviews-routes";
import { GamesRoutes } from "./game-route";
import { GameFeelRoutes } from "./gameFeel-route";

const router: Router = Router();

router.use("/", UsersRoutes);
router.use("/", UploadRoutes);
router.use("/", ImagesRoutes);
router.use("/", AuthRoutes);
router.use("/", ReviewRoutes);
router.use("/", GamesRoutes);
router.use("/", GameFeelRoutes);

export const MainRouter: Router = router;
