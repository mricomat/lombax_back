import { IGame } from "./game-interface";
import { IUser } from "./user-interface";

export interface IDiary {
  game: IGame;
  user: IUser;
  review: IReview;
  gameFeel: IGameFeel;
  type: DiaryType;
  action: DiaryAction;
}

export enum DiaryType {
  Review = "REVIEW",
  GameFeel = "GAME_FEEl",
  //
  //
}

export enum DiaryAction {
  Add = "ADD",
  Edit = "EDIT",
  Remove = "REMOVE",
}

export interface IReview {
  user: IUser;
  game: IGame;
  summary?: string;
  rating?: string;
  dateFinished?: string;
  timeToBeat?: string;
}

export interface IGameFeel {
  user: IUser;
  game: IGame;
  played?: boolean;
  like?: boolean;
}
