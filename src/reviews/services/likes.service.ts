import { Repository } from "typeorm";
import { ErrorMessages } from 'src/utils/error-messages';
import { UserEntity } from "src/users/entity/user.entity";
import { PaginationQueryInterface } from 'src/common/queries/pagination.query';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { ListResponseDto } from 'src/common/dto/list-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { ReviewEntity } from '../entities/review.entity';
import { LikeEntity } from '../entities/like.entity';
import { CommentEntity } from '../entities/comment.entity';
import { ListReviewLikesResponseDto } from "../dto/list-review-likes-response.dto";

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(ReviewEntity) private readonly reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(LikeEntity) private readonly likesRepository: Repository<LikeEntity>,
    @InjectRepository(CommentEntity) private readonly commentsRepository: Repository<CommentEntity>,
  ) {}

  async likeReview(reviewId: string, user: UserEntity): Promise<SuccessResponseDto> {
    const review = await this.reviewRepository.findOne({ id: reviewId }, { select: ["id"] });

    if (!review) {
      throw new NotFoundException(ErrorMessages.ReviewNotFound);
    }

    const previousLike = await this.likesRepository.findOne({ review, user }, { select: ["id"] });

    if (previousLike) {
      throw new BadRequestException(ErrorMessages.ReviewAlreadyLiked);
    }

    await this.likesRepository.save({ user, review });

    return {
      status: "successful",
    };
  }

  async unlikeReview(reviewId: string, user: UserEntity): Promise<SuccessResponseDto> {
    const review = await this.reviewRepository.findOne({ id: reviewId }, { select: ["id"] });

    if (!review) {
      throw new NotFoundException(ErrorMessages.ReviewNotFound);
    }

    await this.likesRepository.delete({ review, user });

    return { status: "successful" };
  }

  async listReviewsLikes(reviewId: string, paginationQuery: PaginationQueryInterface): Promise<ListResponseDto<ListReviewLikesResponseDto>> {
    const { skip, take } = paginationQuery;

    const review = await this.reviewRepository.findOne({ id: reviewId }, { select: ["id"] });

    if (!review) {
      throw new NotFoundException(ErrorMessages.ReviewNotFound);
    }

    const [items, totalItems] = await this.likesRepository
      .createQueryBuilder("like")
      .leftJoinAndSelect("like.user", "user")
      .leftJoinAndSelect("user.avatarImage", "image")
      .select(["like.id", "like.createdAt", "user.id", "user.name", "user.lastName", "user.username"])
      .where({ review })
      .skip(skip)
      .take(take)
      .orderBy("like.createdAt", "DESC")
      .getManyAndCount();

    return {
      items,
      totalItems,
    };
  }

  async likeComment(commentId: string, user: UserEntity): Promise<SuccessResponseDto> {
    const comment = await this.commentsRepository.findOne({ id: commentId }, { select: ["id"] });

    if (!comment) {
      throw new NotFoundException(ErrorMessages.ReviewNotFound);
    }

    const previousLike = await this.likesRepository.findOne({ comment, user }, { select: ["id"] });

    if (previousLike) {
      throw new BadRequestException(ErrorMessages.CommentIsAlreadyLiked);
    }

    await this.likesRepository.save({ user, comment });

    return {
      status: "successful",
    };
  }

  async unlikeComment(commentId: string, user: UserEntity): Promise<SuccessResponseDto> {
    const comment = await this.commentsRepository.findOne({ id: commentId }, { select: ["id"] });

    if (!comment) {
      throw new NotFoundException(ErrorMessages.ReviewNotFound);
    }

    await this.likesRepository.delete({ comment, user });

    return { status: "successful" };
  }

  async listCommentLikes(commentId: string, paginationQuery: PaginationQueryInterface): Promise<ListResponseDto<ListReviewLikesResponseDto>> {
    const { skip, take } = paginationQuery;

    const comment = await this.commentsRepository.findOne({ id: commentId }, { select: ["id"] });

    if (!comment) {
      throw new NotFoundException(ErrorMessages.ReviewNotFound);
    }

    const [items, totalItems] = await this.likesRepository
      .createQueryBuilder("like")
      .leftJoinAndSelect("like.user", "user")
      .leftJoinAndSelect("user.avatarImage", "image")
      .select(["like.id", "like.createdAt", "user.id", "user.name", "user.lastName", "user.username"])
      .where({ comment })
      .skip(skip)
      .take(take)
      .orderBy("like.createdAt", "DESC")
      .getManyAndCount();

    return {
      items,
      totalItems,
    };
  }
}
