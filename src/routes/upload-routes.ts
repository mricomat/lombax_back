import { NextFunction, Request, Response, Router } from "express";

import upload from "../middleware/upload";
import IImageModel, { Image } from "../database/models/image.model";

const router: Router = Router();

/**
 * GET /api/upload
 */
router.get("/upload", (req: Request, res: Response, next: NextFunction) => {
  return res.json({ test: "test" });
});

/**
 * POST /api/upload
 */
router
  .route("/upload")
  .post(
    upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
      Image.findOne({ name: req.file.id })
        .then((image) => {
          if (image) {
            return res.status(200).json({
              success: false,
              message: "Image already exists",
            });
          }

          let newImage = new Image({
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
    }
  );

export const UploadRoutes: Router = router;
