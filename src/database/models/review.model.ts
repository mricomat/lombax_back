import { Document, Model, model, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import { IReview } from "../../interfaces/diary-interface";

export default interface IReviewModel extends IReview, Document {}

// ISSUE: Own every parameter and any missing dependencies
const ReviewSchema = new Schema(
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

ReviewSchema.plugin(mongoosePaginate);

export const Review: PaginateModel<IReviewModel> = model<IReviewModel>(
  "Review",
  ReviewSchema
);
