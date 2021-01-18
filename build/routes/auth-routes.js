"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const authentication_1 = require("../utilities/authentication");
const user_model_1 = require("../database/models/user.model");
const upload_1 = __importDefault(require("../middleware/upload"));
const image_model_1 = require("../database/models/image.model");
const mongodb_1 = require("mongodb");
const router = express_1.Router();
/**
 * POST /api/users
 */
router.post("/login", (req, res, next) => {
    if (!req.body.email) {
        return res.status(422).json({ errors: { email: "Can't be blank" } });
    }
    if (!req.body.password) {
        return res.status(422).json({ errors: { password: "Can't be blank" } });
    }
    passport_1.default.authenticate("local", { session: false }, async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (user) {
            user.token = user.generateJWT();
            return res.json({ user: user.toAuthJSON() });
        }
        else {
            return res.status(422).json(info);
        }
    })(req, res, next);
});
router.post("/refreshToken", authentication_1.authentication.required, async (req, res, next) => {
    const resToken = authentication_1.validateToken(req);
    if (!resToken) {
        return res.status(422).json("info");
    }
    const counts = await user_model_1.User.aggregate()
        .match({ _id: new mongodb_1.ObjectId(resToken.id) })
        .project({
        _id: 0,
        reviewsCount: {
            $size: "$reviews",
        },
        diaryCount: {
            $size: "$diary",
        },
        gameFeelsCount: {
            $size: "$gameFeels",
        },
    });
    user_model_1.User.findById(resToken.id)
        .populate({
        path: "diary",
        populate: {
            path: "review",
            select: "game.imageId rating summary",
        },
        options: { sort: { createdAt: -1 }, limit: 15 },
    })
        .populate({
        path: "diary",
        populate: {
            path: "gameFeel",
            select: "game.imageId gameStatus like",
        },
        options: { sort: { createdAt: -1 }, limit: 15 },
    })
        .then((user) => {
        if (!user) {
            return res.status(404).json({ errors: "User doesn't found" });
        }
        user.token = user.generateJWT();
        const userJson = user.toAuthJSON();
        return res.json({ user: Object.assign(Object.assign({}, userJson), { counts: counts[0] }) });
    })
        .catch(next);
});
router
    .route("/register")
    .post(upload_1.default.array("file", 12), (req, res, next) => {
    const files = req.files;
    console.log(req.body);
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
    // const user: IUserModel = new User();
    // user.name = req.body.name;
    // user.username = req.body.username;
    // user.email = req.body.email;
    // user.setPassword(req.body.password);
    // user.summary = req.body.summary;
    // user.coverId = req.body.coverId;
    // user.backgroundId = req.body.backgroundId;
    // user.interests = req.body.interests;
    // user.coverId = imagesId[0] || "";
    // user.backgroundId = imagesId[1] || "";
    // return user
    //   .save()
    //   .then(() => {
    //     console.log("user saved", user);
    //     return res.json({ user: user.toAuthJSON() });
    //   })
    //   .catch((error) => {
    //     console.log("user errr", error);
    //     return res.status(200).json({
    //       success: false,
    //       message: "Image already exists",
    //     });
    //     return next(error);
    //   });
});
exports.AuthRoutes = router;
//# sourceMappingURL=auth-routes.js.map