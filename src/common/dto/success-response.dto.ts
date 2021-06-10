import { ApiResponseProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiResponseProperty()
  status: 'successful';
}
