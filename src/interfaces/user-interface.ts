import User from "../database/models/user.model";
import Review from "../database/models/review.model";
import GameFeel from "../database/models/gameFeel.model";
import Diary from "../database/models/diary.model";

export interface IUser {
  name: string;
  email: string;
  username: string;
  summary?: string;
  coverId: string;
  backgroundId: string;
  interests: IGenre[];
  following: User[];
  followers: User[];
  reviews: Review[];
  gamesFeels: GameFeel[];
  diary: Diary[];
}

export enum GenreType {
  Genre = "GENRE",
  Theme = "THEME",
}

export interface IGenre {
  id: string;
  type: GenreType;
  name: string;
}

export interface IImage {
  name: string;
  fileId: string;
}