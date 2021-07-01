import { GameRequestDto } from 'src/games/dto/game-request.dto';
import { GameStatusEnum } from 'src/gameFeel/enum/gameStatus.enum';
import { IsDate, IsNotEmpty, IsString, IsNumberString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { IsAlphaBlank } from '../../common/custom-validators/is-alpha-blank.custom-validator';

export class ReviewRequestDto {
  @ApiProperty()
  @Type(() => GameRequestDto)
  @IsNotEmpty()
  game: GameRequestDto;

  @ApiProperty()
  @IsString()
  @IsAlphaBlank()
  @IsNotEmpty()
  summary: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  rating: number;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  dateFinished: Date;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  timeToBeat: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gameStatus: GameStatusEnum;
}
