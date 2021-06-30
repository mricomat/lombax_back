import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";

import { CommentEntity } from "../entities/comment.entity";

import { ErrorMessages } from "../../utils/error-messages";
import { RolesEnum } from "../../users/enums/roles.enum";
import { UserEntity } from "../../users/entity/user.entity";

import { PaginationQueryInterface } from "../../common/queries/pagination.query";
import { SuccessResponseDto } from "../../common/dto/success-response.dto";
import { ListResponseDto } from "../../common/dto/list-response.dto";
import { ReviewEntity } from "../entities/review.entity";
import { ListCommentsResponseDto } from "../dto/list-comments-response.dto";
import { CreateCommentRequestDto } from "../dto/create-comment-request.dto";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(ReviewEntity) private readonly reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(CommentEntity) private readonly commentsRepository: Repository<CommentEntity>,
  ) {}

  async listPostComments(
    reviewId: string,
    paginationQuery: PaginationQueryInterface,
    user: UserEntity,
  ): Promise<ListResponseDto<ListCommentsResponseDto>> {
    const review = await this.reviewRepository.findOne({ id: reviewId }, { select: ["id"] });

    if (!review) {
      throw new NotFoundException(ErrorMessages.ReviewNotFound);
    }

    const { take, skip } = paginationQuery;

    const query = this.commentsRepository
      .createQueryBuilder("comment")
      .leftJoinAndSelect("comment.user", "user")
      .leftJoinAndSelect("user.avatarImage", "image")
      .leftJoinAndSelect("comment.likes", "like-parent", "like-parent.user.id = :userId", { userId: user.id })
      .loadRelationCountAndMap("comment.totalLikes", "comment.likes")
      .select([
        "comment.id",
        "comment.createdAt",
        "comment.text",
        "like-parent",
        "user.id",
        "user.name",
        "user.lastName",
        "user.username",
        "image.id",
        "image.name",
        "image.mimetype",
        "image.url",
      ])
      .where({
        review,
      })
      .take(take)
      .skip(skip)
      .orderBy("comment.createdAt", "ASC");

    const [items, totalItems] = await query.getManyAndCount();

    return { items, totalItems };
  }

  async createComment(reviewId: string, createCommentBody: CreateCommentRequestDto, user: UserEntity): Promise<CommentEntity> {
    const review = await this.reviewRepository.findOne({ id: reviewId }, { select: ["id"] });

    if (!review) {
      throw new NotFoundException(ErrorMessages.ReviewNotFound);
    }

    return this.commentsRepository.save({ ...createCommentBody, review, user });
  }

  async createChildComment(reviewId: string, commentId: string, createCommentBody: CreateCommentRequestDto, user: UserEntity): Promise<CommentEntity> {
    const reviewPromise = this.reviewRepository.findOne({ id: reviewId }, { select: ["id"] });

    const parentCommentPromise = this.commentsRepository
      .createQueryBuilder("comment")
      .leftJoinAndSelect("comment.parentComment", "parent")
      .leftJoinAndSelect("comment.post", "post")
      .select(["comment.id", "parent.id", "post.id"])
      .where({ id: commentId })
      .getOne();

    const [post, parentComment] = await Promise.all([reviewPromise, parentCommentPromise]);

    if (!post) {
      throw new NotFoundException(ErrorMessages.ReviewNotFound);
    }

    if (!parentComment) {
      throw new NotFoundException(ErrorMessages.CommentNotFound);
    }

    if (parentComment.parentComment) {
      throw new BadRequestException(ErrorMessages.CommentIsNotParent);
    }

    return this.commentsRepository.save({
      ...createCommentBody,
      parentComment,
      user,
    });
  }

  async deleteComment(reviewId: string, commentId: string, user: UserEntity): Promise<SuccessResponseDto> {
    const review = await this.reviewRepository.findOne({ id: reviewId }, { select: ["id"] });

    if (!review) {
      throw new NotFoundException(ErrorMessages.ReviewNotFound);
    }

    const comment = await this.commentsRepository
      .createQueryBuilder("comment")
      .leftJoinAndSelect("comment.user", "user")
      .select(["comment.id", "user.id"])
      .where({ id: commentId, review })
      .getOne();

    if (!comment) {
      throw new NotFoundException(ErrorMessages.CommentNotFound);
    }

    // if (comment.user.id !== user.id && user.role !== RolesEnum.ADMINISTRATOR) {
    //   throw new ForbiddenException(ErrorMessages.UnauthorizedUser);
    // }

    await this.commentsRepository.delete(comment);

    return { status: "successful" };
  }
}
