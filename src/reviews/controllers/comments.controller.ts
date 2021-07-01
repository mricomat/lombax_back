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
} from "@nestjs/swagger";
import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";

import { CommentsService } from "../services/comments.service";
import { ListReviewLikesResponseDto } from '../dto/list-review-likes-response.dto';
import { RolesEnum } from "../../users/enums/roles.enum";
import { UserEntity } from '../../users/entity/user.entity';
import { RequestUserQuery } from "../../common/queries/request-user.query";
import { PaginationQuery, PaginationQueryInterface } from '../../common/queries/pagination.query';
import { ValidationException } from "../../common/exceptions/validation.exception";
import { SuccessResponseDto } from '../../common/dto/success-response.dto';
import { ListResponseDto } from "../../common/dto/list-response.dto";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { LikesService } from '../services/likes.service';

@ApiTags('Comments')
@Controller('reviews/comments')
export class CommentsController {
  constructor(private readonly likesService: LikesService, private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard)
  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @ApiBearerAuth()
  @Get(':commentId/likes')
  @ApiOperation({
    description: "List a comment's likes",
  })
  @ApiParam({
    name: 'commentId',
    required: true,
    type: 'string',
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
  listCommentLikes(
    @Param('commentId') commentId: string,
    @PaginationQuery() paginationQuery: PaginationQueryInterface,
  ): Promise<ListResponseDto<ListReviewLikesResponseDto>> {
    return this.likesService.listCommentLikes(commentId, paginationQuery);
  }

  @UseGuards(AuthGuard)
  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @ApiBearerAuth()
  @Post(':commentId/likes')
  @ApiOperation({
    description: 'Creates a new like for a comment',
  })
  @ApiParam({
    name: 'commentId',
    required: true,
    type: 'string',
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
  likePost(@Param('commentId') commentId: string, @RequestUserQuery() user: UserEntity): Promise<SuccessResponseDto> {
    return this.likesService.likeComment(commentId, user);
  }

  @UseGuards(AuthGuard)
  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @ApiBearerAuth()
  @Delete(':commentId/likes')
  @ApiOperation({
    description: 'Delete a like for a post',
  })
  @ApiParam({
    name: 'commentId',
    required: true,
    type: 'string',
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
  unlikePost(@Param('commentId') commentId: string, @RequestUserQuery() user: UserEntity): Promise<SuccessResponseDto> {
    return this.likesService.unlikeComment(commentId, user);
  }
}
