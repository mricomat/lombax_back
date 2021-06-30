import { ApiResponseProperty } from '@nestjs/swagger';

export class GetAvgTimeToBeatGameDto {
  @ApiResponseProperty()
  timeToBeat: number;

  @ApiResponseProperty()
  numOfReviews: number;
}
