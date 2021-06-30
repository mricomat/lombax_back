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
  Get,
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
  ApiParam,
  ApiOkResponse,
} from "@nestjs/swagger";

import { SuccessResponseDto } from "../../common/dto/success-response.dto";
import { ValidationException } from "../../common/exceptions/validation.exception";
import { RolesEnum } from "../../users/enums/roles.enum";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { UserEntity } from "src/users/entity/user.entity";
import { ReviewRequestDto } from "src/reviews/dto/review-request.dto";
import { RequestUserQuery } from "../../common/queries/request-user.query";
import { ReviewsService } from "../services/reviews.service";
import { PaginationQuery, PaginationQueryInterface } from "src/common/queries/pagination.query";
import { FilterByQuery } from "src/common/queries/filter-by.query";
import { FilterByFieldTypeEnum } from "src/common/enums/filter-by-field-type.enum";
import { ReviewEntity } from "../entities/review.entity";
import { ListResponseDto } from "src/common/dto/list-response.dto";

@ApiTags("Reviews")
@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthGuard)
  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    description: "Register a review of a game",
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
  saveReview(@RequestUserQuery() user: UserEntity, @Body() reviewBody: ReviewRequestDto): Promise<SuccessResponseDto> {
    return this.reviewsService.saveNewReview(user, reviewBody);
  }

  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @Get()
  @ApiOperation({
    description: "Get game reviews",
  })
  @ApiParam({
    name: "gameIdS",
    description: "game id of the IGDB service",
    required: true,
    type: "string",
  })
  @ApiParam({
    name: "maxRating",
    description: "Sort type by max rating",
    required: true,
    type: "string",
  })
  @ApiParam({
    name: "minRating",
    description: "Sort by max minRating",
    required: true,
    type: "string",
  })
  @ApiParam({
    name: "popularity",
    description: "Filter by popularity",
    required: true,
    type: "string",
  })
  @ApiOkResponse({
    type: ListResponseDto,
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
  getGameReviews(
    @PaginationQuery() paginationQuery: PaginationQueryInterface,
    @FilterByQuery({ field: "gameIds", type: FilterByFieldTypeEnum.STRING }) gameIdS: string,
    @FilterByQuery({ field: "maxRating", type: FilterByFieldTypeEnum.STRING }) maxRating: string,
    @FilterByQuery({ field: "minRating", type: FilterByFieldTypeEnum.STRING }) minRating: string,
    @FilterByQuery({ field: "popularity", type: FilterByFieldTypeEnum.STRING }) popularity: string,
  ): Promise<ListResponseDto<ReviewEntity>> {
    return this.reviewsService.getGameReviews(paginationQuery, gameIdS, { maxRating, minRating, popularity });
  }
}
