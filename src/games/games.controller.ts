import {
  BadRequestException,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
  SetMetadata,
  UseGuards,
  UnauthorizedException,
  Body,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";

import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { ValidationException } from "../common/exceptions/validation.exception";
import { RolesEnum } from "../users/enums/roles.enum";
import { GameRequestDto } from "./dto/game-request.dto";
import { GamesService } from "./games.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { GameEntity } from "./game.entity";

@ApiTags("Games")
@Controller("games")
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @UseGuards(AuthGuard)
  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @ApiBearerAuth()
  @Post()
  @ApiOperation({
    description: "Register a game",
  })
  @ApiCreatedResponse({
    type: SuccessResponseDto,
  })
  @ApiConflictResponse({
    type: ConflictException,
  })
  @ApiUnprocessableEntityResponse({
    type: ValidationException,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedException,
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
  })
  saveGame(@Body() gameBody: GameRequestDto): Promise<GameEntity> {
    return this.gamesService.saveNewGame(gameBody);
  }
}
