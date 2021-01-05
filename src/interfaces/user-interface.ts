import User from "../database/models/user.model";

export interface IUser {
  name: string;
  email: string;
  username: string;
  summary?: string;
  coverId: string;
  backgroundId: string;
  interests: IGenre[];
  following: User[];
}

export interface IProfile {
  username: string;
  bio: string;
  image: string;
  following: boolean;
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
