import { UserEntity } from 'src/users/entity/user.entity';
import { RequestUserQuery } from "src/common/queries/request-user.query";
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
  ApiParam,
  ApiOkResponse,
} from '@nestjs/swagger';
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
  Param,
  Get,
} from '@nestjs/common';

import { GamesService } from './games.service';
import { GameEntity } from './game.entity';
import { GetGameInfoDto } from './dto/get-game-info.dto';
import { GameRequestDto } from "./dto/game-request.dto";
import { RolesEnum } from '../users/enums/roles.enum';
import { ValidationException } from "../common/exceptions/validation.exception";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { AuthGuard } from "../auth/guards/auth.guard";

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

  @UseGuards(AuthGuard)
  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @ApiBearerAuth()
  @Get(":gameIdS")
  @ApiOperation({
    description: "Get game info",
  })
  @ApiParam({
    name: "gameIdS",
    required: true,
    type: "string",
  })
  @ApiOkResponse({
    type: GetGameInfoDto,
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedException,
  })
  @ApiUnprocessableEntityResponse({
    type: ValidationException,
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
  })
  getUserProfile(@RequestUserQuery() user: UserEntity, @Param("gameIdS") gameIdS: string): Promise<GetGameInfoDto> {
    return this.gamesService.getGameInfo(user, gameIdS);
  }
}
