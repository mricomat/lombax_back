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
  Param,
  Delete,
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
  ApiNoContentResponse,
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
import { CommentEntity } from "../entities/comment.entity";
import { CreateCommentRequestDto } from "../dto/create-comment-request.dto";
import { CommentsService } from "../services/comments.service";
import { ListCommentsResponseDto } from "../dto/list-comments-response.dto";
import { ListReviewLikesResponseDto } from "../dto/list-review-likes-response.dto";
import { LikesService } from "../services/likes.service";

@ApiTags("Reviews")
@Controller("reviews")
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly commentsService: CommentsService,
    private readonly likesService: LikesService,
  ) {}

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

  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @Get(":reviewId")
  @ApiOperation({
    description: "Get a review by ID",
  })
  @ApiParam({
    name: "reviewId",
    type: "string",
    required: true,
  })
  @ApiOkResponse({
    type: ReviewEntity,
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
  getPostById(@Param("reviewId") reviewId: string): Promise<ReviewEntity> {
    return this.reviewsService.getGameReviewById(reviewId);
  }

  @UseGuards(AuthGuard)
  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @ApiBearerAuth()
  @Delete(":reviewId")
  @ApiOperation({
    description: "Delete a Review",
  })
  @ApiParam({
    name: "reviewId",
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
  @ApiUnprocessableEntityResponse({
    type: ValidationException,
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
  })
  deletePost(@Param("reviewId") reviewId: string, @RequestUserQuery() user: UserEntity): Promise<SuccessResponseDto> {
    return this.reviewsService.deleteReview(reviewId, user);
  }

  @UseGuards(AuthGuard)
  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @ApiBearerAuth()
  @Post(":reviewId/comments")
  @ApiOperation({
    description: "Creates a new comment for a review",
  })
  @ApiParam({
    name: "reviewId",
    required: true,
    type: "string",
  })
  @ApiCreatedResponse({
    type: CommentEntity,
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
  createComment(
    @Param("reviewId") reviewId: string,
    @RequestUserQuery() user: UserEntity,
    @Body() createCommentBody: CreateCommentRequestDto,
  ): Promise<CommentEntity> {
    return this.commentsService.createComment(reviewId, createCommentBody, user);
  }

  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @Get(":reviewId/comments")
  @ApiOperation({
    description: "List a review's comments",
  })
  @ApiParam({
    name: "reviewId",
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
  listReviewComments(
    @Param("reviewId") reviewId: string,
    @PaginationQuery() paginationQuery: PaginationQueryInterface,
    @RequestUserQuery() user: UserEntity,
  ): Promise<ListResponseDto<ListCommentsResponseDto>> {
    return this.commentsService.listReviewComments(reviewId, paginationQuery, user);
  }

  @UseGuards(AuthGuard)
  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @ApiBearerAuth()
  @Post(":reviewId/comments/:commentId")
  @ApiOperation({
    description: "Creates a new nested comment for a review",
  })
  @ApiParam({
    name: "reviewId",
    required: true,
    type: "string",
  })
  @ApiParam({
    name: "commentId",
    required: true,
    type: "string",
  })
  @ApiCreatedResponse({
    type: CommentEntity,
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
  createChildComment(
    @Param("reviewId") reviewId: string,
    @Param("commentId") commentId: string,
    @RequestUserQuery() user: UserEntity,
    @Body() createCommentBody: CreateCommentRequestDto,
  ): Promise<CommentEntity> {
    return this.commentsService.createChildComment(reviewId, commentId, createCommentBody, user);
  }
  @UseGuards(AuthGuard)
  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @ApiBearerAuth()
  @Delete(":reviewId/comments/:commentId")
  @ApiOperation({
    description: "Delete a comment",
  })
  @ApiParam({
    name: "reviewId",
    required: true,
    type: "string",
  })
  @ApiParam({
    name: "commentId",
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
  @ApiUnprocessableEntityResponse({
    type: ValidationException,
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
  })
  deleteComment(
    @Param("reviewId") reviewId: string,
    @Param("commentId") commentId: string,
    @RequestUserQuery() user: UserEntity,
  ): Promise<SuccessResponseDto> {
    return this.commentsService.deleteComment(reviewId, commentId, user);
  }

  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @Get(":reviewId/likes")
  @ApiOperation({
    description: "List a review's likes",
  })
  @ApiParam({
    name: "reviewId",
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
  listPostLikes(
    @Param("reviewId") reviewId: string,
    @PaginationQuery() paginationQuery: PaginationQueryInterface,
    @RequestUserQuery() user: UserEntity,
  ): Promise<ListResponseDto<ListReviewLikesResponseDto>> {
    return this.likesService.listReviewsLikes(reviewId, paginationQuery);
  }

  @UseGuards(AuthGuard)
  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @ApiBearerAuth()
  @Post(":reviewId/likes")
  @ApiOperation({
    description: "Creates a new like for a review",
  })
  @ApiParam({
    name: "reviewId",
    required: true,
    type: "string",
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
  @ApiUnprocessableEntityResponse({
    type: ValidationException,
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
  })
  likePost(@Param("reviewId") reviewId: string, @RequestUserQuery() user: UserEntity): Promise<SuccessResponseDto> {
    return this.likesService.likeReview(reviewId, user);
  }

  @UseGuards(AuthGuard)
  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @ApiBearerAuth()
  @Delete(":reviewId/likes")
  @ApiOperation({
    description: "Delete a like for a review",
  })
  @ApiParam({
    name: "reviewId",
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
  @ApiUnprocessableEntityResponse({
    type: ValidationException,
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
  })
  unlikePost(@Param("reviewId") reviewId: string, @RequestUserQuery() user: UserEntity): Promise<SuccessResponseDto> {
    return this.likesService.unlikeReview(reviewId, user);
  }
}
