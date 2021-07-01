import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { GameRequestDto } from "src/games/dto/game-request.dto";
import { GameFeelEntity } from 'src/gameFeel/gameFeel.entity';
import { IsNotEmpty, IsOptional } from "class-validator";
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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
