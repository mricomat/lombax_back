import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";

import { UsersService } from "./users.service";
import { RolesEnum } from "./enums/roles.enum";
import { UserEntity } from './entity/user.entity';
import { GetUserProfileResponseDto } from './dto/get-user-profile-response.dto';
import { RequestUserQuery } from "../common/queries/request-user.query";
import { ValidationException } from "../common/exceptions/validation.exception";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(AuthGuard)
  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @ApiBearerAuth()
  @Get(":userId")
  @ApiOperation({
    description: "Get a user profile",
  })
  @ApiParam({
    name: "userId",
    required: true,
    type: "string",
  })
  @ApiOkResponse({
    type: GetUserProfileResponseDto,
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
  getUserProfile(@RequestUserQuery() user: UserEntity, @Param("userId") userId: string): Promise<GetUserProfileResponseDto> {
    return this.usersService.getUserProfile(userId, user);
  }
}
