import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { GameFeelEntity } from "src/gameFeel/gameFeel.entity";
import { ApiResponseProperty } from "@nestjs/swagger";

import { GetAvgTimeToBeatGameDto } from './get-avg-timeToBeat-game.dto';
import { GetAvgRatingGameDto } from './get-avg-rating-game.dto';

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
