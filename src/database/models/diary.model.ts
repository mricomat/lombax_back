import { Document, Model, model, Schema } from "mongoose";
import { IDiary } from "../../interfaces/diary-interface";

export default interface IDiaryModel extends IDiary, Document {}

const DiarySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      unique: false,
      required: [true, "can't be blank"],
      index: true,
    },
    gameId: {
      type: Schema.Types.Number,
      ref: "Game",
      unique: false,
      required: [true, "can't be blank"],
      index: true,
    },
    itemId: {
      type: Schema.Types.ObjectId,
      unique: false,
      required: [true, "can't be blank"],
      index: true,
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

export const Diary: Model<IDiaryModel> = model<IDiaryModel>(
  "Diary",
  DiarySchema
);
