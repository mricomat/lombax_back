import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { Type } from "class-transformer";

import { GameRequestDto } from "src/games/dto/game-request.dto";
import { GameStatusEnum } from "../enum/gameStatus.enum";

export class GameFeelRequestDto {
  @ApiProperty()
  @Type(() => GameRequestDto)
  @IsNotEmpty()
  game: GameRequestDto;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gameStatus: GameStatusEnum;
}
