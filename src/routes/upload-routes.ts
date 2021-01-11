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

/**
 * POST /api/upload
 */
router
  .route("/multipleUpload")
  .post(
    upload.array("file", 3),
    (req: Request, res: Response, next: NextFunction) => {
      const files = req.files as Express.Multer.File[];

      Image.find({
        $or: [{ name: files[0].filename }, { name: files[1].filename }],
      }).then(async (image) => {
        if (image.length > 0) {
          return res.status(200).json({
            success: false,
            message: "Image already exists",
          });
        }

        const imagesIdPromise = await files.map((f) => {
          let newImage = new Image({
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
    }
  );

export const UploadRoutes: Router = router;
