import { RolesEnum } from 'src/users/enums/roles.enum';
import { IGDBSectionDto } from 'src/igdb/igdb-section.dto';
import { FilterByQuery } from "src/common/queries/filter-by.query";
import { ValidationException } from "src/common/exceptions/validation.exception";
import { FilterByFieldTypeEnum } from "src/common/enums/filter-by-field-type.enum";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { FeedService } from "./feed.service";

@ApiTags("Feed")
@Controller("feed")
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @Get("/main")
  @ApiOperation({
    description: "Get main feed",
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
  getMainFeed(): Promise<IGDBSectionDto[]> {
    return this.feedService.getMainFeed();
  }

  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @Get("/sections")
  @ApiOperation({
    description: "Get main feed",
  })
  @ApiParam({
    name: "userId",
    required: true,
    type: "string",
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
  getUserProfile(@FilterByQuery({ field: "userId", type: FilterByFieldTypeEnum.STRING }) userId: string): Promise<IGDBSectionDto[]> {
    return this.feedService.getSectionsFeed(userId);
  }
}
