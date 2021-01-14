import { IGame } from "./game-interface";
import User from "../database/models/user.model";
import Review from "../database/models/review.model";
import GameFeel from "../database/models/gameFeel.model";

export interface IDiary {
  game: IGame;
  user: User["_id"];
  review: Review["_id"];
  gameFeel: GameFeel["_id"];
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
  user: User["_id"];
  game: IGame;
  summary?: string;
  rating?: number;
  dateFinished?: string;
  timeToBeat?: string;
}

export interface IGameFeel {
  user: User["_id"];
  game: IGame;
  played?: boolean;
  like?: boolean;
}
