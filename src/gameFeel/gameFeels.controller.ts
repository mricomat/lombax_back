import {
  BadRequestException,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
  SetMetadata,
  Body,
  UseGuards,
  UnauthorizedException,
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
import { UserEntity } from "src/users/entity/user.entity";

import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { ValidationException } from "../common/exceptions/validation.exception";
import { RolesEnum } from "../users/enums/roles.enum";
import { GameFeelRequestDto } from "./dto/gameFeel-request.dto";
import { GamesFeelsService } from "./gameFeels.service";
import { RequestUserQuery } from "../common/queries/request-user.query";
import { AuthGuard } from "../auth/guards/auth.guard";

@ApiTags("GamesFeels")
@Controller("gamesFeels")
export class GameFeelsController {
  constructor(private readonly gamesFeelsService: GamesFeelsService) {}

  @UseGuards(AuthGuard)
  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    description: "Register a gameFeel of a game",
  })
  @ApiCreatedResponse({
    type: SuccessResponseDto,
  })
  @ApiConflictResponse({
    type: ConflictException,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedException,
  })
  @ApiUnprocessableEntityResponse({
    type: ValidationException,
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
  })
  saveGame(@RequestUserQuery() user: UserEntity, @Body() gameFeelBody: GameFeelRequestDto): Promise<SuccessResponseDto> {
    return this.gamesFeelsService.saveNewGameFeel(user, gameFeelBody);
  }
}
