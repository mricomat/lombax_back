import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { trimStringHelper } from '../../utils/transformers-helpers/trim-string-helper';

export class CreateCommentRequestDto {
  @ApiProperty()
  @Transform(trimStringHelper)
  @IsString()
  @IsNotEmpty()
  text: string;
}
