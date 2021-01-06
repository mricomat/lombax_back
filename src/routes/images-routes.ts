import { NextFunction, Request, Response, Router } from "express";
import { gfs } from "../database/index";

const router: Router = Router();

/**
 * GET /api/user
 */
router.get(
  "/images/:filename",
  (req: Request, res: Response, next: NextFunction) => {
    gfs
      .find({ filename: req.params.filename })
      .toArray((err: any, files: any) => {
        if (!files[0] || files.length === 0) {
          return res.status(200).json({
            success: false,
            message: "No files available",
            files,
          });
        }

        if (
          files[0].contentType === "image/jpeg" ||
          files[0].contentType === "image/png" ||
          files[0].contentType === "image/svg+xml"
        ) {
          // render image to browser
          gfs.openDownloadStreamByName(req.params.filename).pipe(res);
        } else {
          res.status(404).json({
            err: "Not an image",
          });
        }
      });
  }
);

export const ImagesRoutes: Router = router;
