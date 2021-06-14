import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString, IsNumberString, IsOptional } from "class-validator";
import { Type } from "class-transformer";

import { GameRequestDto } from "src/games/dto/game-request.dto";
import { IsAlphaBlank } from "../../common/custom-validators/is-alpha-blank.custom-validator";
import { GameStatusEnum } from "src/gameFeel/enum/gameStatus.enum";

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
  @IsString()
  @IsNumberString()
  @IsOptional()
  rating: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  dateFinished: Date;

  @ApiProperty()
  @IsString()
  @IsNumberString()
  @IsOptional()
  timeToBeat: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gameStatus: GameStatusEnum;
}
