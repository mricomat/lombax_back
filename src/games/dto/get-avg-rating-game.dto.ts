import { ApiResponseProperty } from '@nestjs/swagger';

export class GetAvgRatingGameDto {
  @ApiResponseProperty()
  rating: number;

  @ApiResponseProperty()
  numOfReviews: number;
}
