import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";

import { GameFeelEntity } from "src/gameFeel/gameFeel.entity";
import { GameRequestDto } from "src/games/dto/game-request.dto";
import { ReviewEntity } from "src/reviews/entities/review.entity";

export class DiaryRequestDto {
  @ApiProperty()
  @Type(() => GameRequestDto)
  @IsNotEmpty()
  game: GameRequestDto;

  @ApiProperty()
  @Type(() => GameFeelEntity)
  @IsOptional()
  gameFeel?: GameFeelEntity;

  @ApiProperty()
  @Type(() => ReviewEntity)
  @IsOptional()
  review?: ReviewEntity;
}
