import { Document, model, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate";

import { IGameFeel } from "../../interfaces/diary-interface";

export default interface IGameFeelModel extends IGameFeel, Document {}

const GameFeelSchema = new Schema(
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
    },
    played: {
      type: Schema.Types.Boolean,
    },
    like: {
      type: Schema.Types.Boolean,
    },
  },
  { timestamps: true }
);

GameFeelSchema.plugin(mongoosePaginate);

export const GameFeel: PaginateModel<IGameFeelModel> = model<IGameFeelModel>(
  "GameFeel",
  GameFeelSchema
);
