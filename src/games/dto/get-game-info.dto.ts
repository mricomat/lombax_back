import { ApiResponseProperty } from "@nestjs/swagger";

import { GameFeelEntity } from "src/gameFeel/gameFeel.entity";
import { ReviewEntity } from "src/reviews/review.entity";
import { GetAvgRatingGameDto } from "./get-avg-rating-game.dto";
import { GetAvgTimeToBeatGameDto } from "./get-avg-timeToBeat-game.dto copy";

export class GetGameInfoDto {
  @ApiResponseProperty()
  lastReview: ReviewEntity;

  @ApiResponseProperty()
  lastGameFeel: GameFeelEntity;

  @ApiResponseProperty()
  ratingInfo: GetAvgRatingGameDto;

  @ApiResponseProperty()
  timeToBeatInfo: GetAvgTimeToBeatGameDto;
}
