import { IGame } from "./game-interface";

export interface IDiary {
  gameId: number;
  userId: string;
  itemId: string;
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
  userId: string;
  game: IGame;
  summary?: string;
  rating?: string;
  dateFinished?: string;
  timeToBeat?: string;
}

export interface IGameFeel {
  userId: string;
  game: IGame;
  played?: boolean;
  like?: boolean;
}
