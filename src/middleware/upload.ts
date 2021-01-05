import multer from "multer";
import GridFsStorage from "multer-gridfs-storage";
import { DB } from "../utilities/secrets";
import crypto from "crypto";
import path from "path";

// Build the connection string
const dbURI = `mongodb+srv://${DB.USER}:${encodeURIComponent(DB.PASSWORD)}@${
  DB.HOST
}/${DB.NAME}?retryWrites=true&w=majority`;

const storage = new GridFsStorage({
  url: dbURI,
  file: (req: any, file: any) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
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

export default multer({ storage });
