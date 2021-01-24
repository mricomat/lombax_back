import { Document, model, PaginateModel, Schema } from "mongoose";
import { IDiary } from "../../interfaces/diary-interface";

export default interface IDiaryModel extends IDiary, Document {}

const DiarySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: false,
      required: [true, "can't be blank"],
      index: true,
    },
    game: {
      id: {
        type: Schema.Types.Number,
        unique: false,
        required: [true, "can't be blank"],
      },
      imageId: {
        type: Schema.Types.String,
        unique: false,
        required: [true, "can't be blank"],
      },
      backgroundId: {
        type: Schema.Types.String,
        unique: false,
        required: [true, "can't be blank"],
      },
      releaseDate: {
        type: Schema.Types.Number,
        unique: false,
        required: [true, "can't be blank"],
      },
      name: {
        type: Schema.Types.String,
        unique: false,
        required: [true, "can't be blank"],
      },
    },
    review: {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
    gameFeel: {
      type: Schema.Types.ObjectId,
      ref: "GameFeel",
    },
    type: {
      type: Schema.Types.String,
    },
    action: {
      type: Schema.Types.String,
    },
  },
  { timestamps: true }
);

export const Diary: PaginateModel<IDiaryModel> = model<IDiaryModel>(
  "Diary",
  DiarySchema
);
