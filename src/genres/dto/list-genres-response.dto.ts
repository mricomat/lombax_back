import { ApiResponseProperty } from '@nestjs/swagger';

import { GenreEntity } from '../genre.entity';

export class ListGenresResponseDto {
  @ApiResponseProperty({ type: [GenreEntity] })
  genres: GenreEntity[];
}
