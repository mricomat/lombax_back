import { ApiResponseProperty } from '@nestjs/swagger';

export class ListResponseDto<T> {
  @ApiResponseProperty()
  totalItems: number;

  @ApiResponseProperty()
  items: T[];
}
