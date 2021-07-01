import { RequestUserQuery } from 'src/common/queries/request-user.query';
import { ValidationException } from "src/common/exceptions/validation.exception";
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
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
} from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { FollowsService } from './follows.service';
import { CreateFollowRequestDto } from './dto/create-follow-request.dto';
import { RolesEnum } from '../users/enums/roles.enum';
import { UserEntity } from '../users/entity/user.entity';
import { AuthGuard } from "../auth/guards/auth.guard";

@ApiTags("Follows")
@Controller("follows")
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @UseGuards(AuthGuard)
  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @ApiBearerAuth()
  @Post()
  @ApiOperation({
    description: "Create a new friends request",
  })
  @ApiCreatedResponse({
    type: SuccessResponseDto,
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedException,
  })
  @ApiNotFoundResponse({
    type: NotFoundException,
  })
  @ApiUnprocessableEntityResponse({
    type: ValidationException,
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
  })
  createFollowRequest(@Body() createFollowBody: CreateFollowRequestDto, @RequestUserQuery() user: UserEntity): Promise<SuccessResponseDto> {
    return this.followsService.createFollow(user, createFollowBody);
  }

  @UseGuards(AuthGuard)
  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @ApiBearerAuth()
  @Delete(":followId")
  @ApiOperation({
    description: "Deletes a follow from a user",
  })
  @ApiParam({
    name: "followId",
    required: true,
    type: "string",
  })
  @ApiNoContentResponse({
    type: SuccessResponseDto,
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedException,
  })
  @ApiForbiddenResponse({
    type: ForbiddenException,
  })
  @ApiNotFoundResponse({
    type: NotFoundException,
  })
  @ApiUnprocessableEntityResponse({
    type: ValidationException,
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
  })
  deleteFollow(@Param("followId") followId: string, @RequestUserQuery() user: UserEntity): Promise<SuccessResponseDto> {
    return this.followsService.deleteFollow(followId, user);
  }
}
