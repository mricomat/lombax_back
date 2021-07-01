import { GameFeelEntity } from "src/gameFeel/gameFeel.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";

export interface IGDBSectionDto {
  title: string;
  games: any[];
  reviews?: ReviewEntity[];
  gameFeels?: GameFeelEntity[];
}
