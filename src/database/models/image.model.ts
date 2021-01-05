import { Document, Model, model, Schema } from "mongoose";
import { IImage } from "../../interfaces/user-interface";

export default interface IImageModel extends IImage, Document {}

const ImageSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: [true, "can't be blank"],
      index: true,
    },
    fileId: {
      type: Schema.Types.String,
      required: [true, "can't be blank"],
      index: true,
    },
  },
  { timestamps: true }
);

export const Image: Model<IImageModel> = model<IImageModel>(
  "Image",
  ImageSchema
);
