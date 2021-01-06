import { Document, Model, model, Schema } from "mongoose";
import { IReview } from "../../interfaces/diary-interface";

export default interface IReviewModel extends IReview, Document {}

// ISSUE: Own every parameter and any missing dependencies
const ReviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
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
    summary: {
      type: Schema.Types.String,
    },
    rating: {
      type: Schema.Types.String,
    },
    dateFinished: {
      type: Schema.Types.String,
    },
    timeToBeat: {
      type: Schema.Types.String,
    },
  },
  { timestamps: true }
);

export const Review: Model<IReviewModel> = model<IReviewModel>(
  "Review",
  ReviewSchema
);
