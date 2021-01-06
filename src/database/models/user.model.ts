import * as crypto from "crypto";
import { NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { Document, Model, model, Schema } from "mongoose";
import mongooseUniqueValidator = require("mongoose-unique-validator");

import { Review } from "../../database/models/review.model";
import { Diary } from "../../database/models/diary.model";
import { GameFeel } from "../../database/models/gameFeel.model";
import { IUser } from "../../interfaces/user-interface";
import { JWT_SECRET } from "../../utilities/secrets";
import { DiaryAction, IReview } from "../../interfaces/diary-interface";
import { result } from "lodash";

export default interface IUserModel extends IUser, Document {
  token?: string;
  favorites: [Schema.Types.ObjectId];

  generateJWT(): string;
  toAuthJSON(): any;
  setPassword(password: string): void;
  validPassword(password: string): boolean;
  toProfileJSONFor(user: IUserModel): any;
  isFollowing(id: string): boolean;
  follow(id: string): Promise<IUser>;
  unfollow(id: string): Promise<IUser>;
  favorite(id: string): Promise<IUser>;
  unfavorite(id: string): Promise<IUser>;
  isFavorite(id: string): boolean;
  getReviewsCount(id: string, next: NextFunction): number;
  getGamesPlayedCount(id: string, next: NextFunction): number;
  getReviews(id: string, next: NextFunction): IReview[];
  getAditionalInfo(id: string, next: NextFunction): any;
  getRecentActivity(id: string, next: NextFunction): any;
}

// ISSUE: Own every parameter and any missing dependencies
const UserSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      lowercase: false,
      unique: false,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true,
    },
    username: {
      type: Schema.Types.String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true,
    },
    email: {
      type: Schema.Types.String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      //match    : [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    },
    summary: {
      type: Schema.Types.String,
    },
    coverId: {
      type: Schema.Types.String,
    },
    backgroundId: {
      type: Schema.Types.String,
    },
    interests: [
      {
        typeId: Schema.Types.ObjectId,
        type: Schema.Types.String,
        ref: "Genre",
      },
    ],
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Game",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    hash: {
      type: Schema.Types.String,
    },
    salt: {
      type: Schema.Types.String,
    },
  },
  { timestamps: true }
);

UserSchema.plugin(mongooseUniqueValidator, { message: "is already taken." });

UserSchema.methods.validPassword = function (password: string): boolean {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UserSchema.methods.setPassword = function (password: string) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

UserSchema.methods.generateJWT = function (): string {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: exp.getTime() / 1000,
    },
    JWT_SECRET
  );
};

UserSchema.methods.toAuthJSON = function (): any {
  return {
    id: this._id,
    name: this.name,
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    summary: this.summary,
    coverId: this.coverId,
    backgroundId: this.backgroundId,
    interests: this.interests,
    favorites: this.favorites,
    following: this.following,
    reviewsCount: this.reviewsCount,
    gamesPlayed: this.gamesPlayed,
    diary: this.diary,
  };
};

UserSchema.methods.toProfileJSONFor = function (user: IUserModel) {
  return {
    username: this.username,
    bio: this.bio,
    image:
      this.image || "https://static.productionready.io/images/smiley-cyrus.jpg",
    following: user ? user.isFollowing(this._id) : false,
  };
};

UserSchema.methods.favorite = function (id: string) {
  if (this.favorites.indexOf(id) === -1) {
    this.favorites.push(id);
  }

  return this.save();
};

UserSchema.methods.unfavorite = function (id: string) {
  this.favorites.remove(id);
  return this.save();
};

UserSchema.methods.isFavorite = function (id: string) {
  return this.favorites.some(function (favoriteId: string) {
    return favoriteId.toString() === id.toString();
  });
};

UserSchema.methods.follow = function (id: string) {
  if (this.following.indexOf(id) === -1) {
    this.following.push(id);
  }

  return this.save();
};

UserSchema.methods.unfollow = function (id: string) {
  this.following.remove(id);
  return this.save();
};

UserSchema.methods.isFollowing = function (id: string) {
  return this.following.some(function (followId: string) {
    return followId.toString() === id.toString();
  });
};

UserSchema.methods.getReviewsCount = (id: string, next: NextFunction) => {
  return Review.paginate({ userId: id }, { offset: 0, limit: 0 })
    .then((result) => {
      return result.total;
    })
    .catch(next);
};

UserSchema.methods.getReviews = (id: string, next: NextFunction) => {
  return Review.find({ userId: id })
    .then((result) => {
      return result;
    })
    .catch(next);
};

UserSchema.methods.getGamesPlayedCount = (id: string, next: NextFunction) => {
  return Review.paginate({ userId: id }, { offset: 0, limit: 0 })
    .then((result) => {
      return result.total;
    })
    .catch(next);
};

UserSchema.methods.getAditionalInfo = (id: string, next: NextFunction) => {
  return Review.find({ userId: id })
    .then((result) => {
      const gamesIds = result.map((item) => item.game.id);
      return GameFeel.find({
        userId: id,
        played: true,
        gameId: { $nin: [...gamesIds] },
      })
        .then((res) => {
          return {
            reviewsCount: result.length,
            gamesPlayed: res.length + result.length,
          };
        })
        .catch(next);
    })
    .catch(next);
};

UserSchema.methods.getRecentActivity = (id: any, next: NextFunction) => {
  return Diary.find({ user: id, action: { $ne: DiaryAction.Remove } })
    .populate("review", { rating: 1, "game.id": 1 })
    .populate("gameFeel")
    .then((result) => {
      return result;
    })
    .catch(next);
};

export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);
