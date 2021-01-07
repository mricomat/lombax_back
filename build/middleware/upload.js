"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multer_gridfs_storage_1 = __importDefault(require("multer-gridfs-storage"));
const secrets_1 = require("../utilities/secrets");
const crypto_1 = __importDefault(require("crypto"));
// Build the connection string
const dbURI = `mongodb+srv://${secrets_1.DB.USER}:${encodeURIComponent(secrets_1.DB.PASSWORD)}@${secrets_1.DB.HOST}/${secrets_1.DB.NAME}?retryWrites=true&w=majority`;
const storage = new multer_gridfs_storage_1.default({
    url: dbURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto_1.default.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString("hex");
                const fileInfo = {
                    filename: filename,
                    bucketName: "uploads",
                };
                resolve(fileInfo);
            });
        });
    },
});
exports.default = multer_1.default({ storage });
//# sourceMappingURL=upload.js.map