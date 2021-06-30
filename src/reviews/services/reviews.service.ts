import { ObjectLiteral, Repository, Connection } from "typeorm";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import { Injectable, ConflictException, BadRequestException } from "@nestjs/common";

import { SuccessResponseDto } from "../../common/dto/success-response.dto";
import { GameFeelEntity } from "../../gameFeel/gameFeel.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { GameEntity } from "src/games/game.entity";
import { GamesService } from "src/games/games.service";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewRequestDto } from "../dto/review-request.dto";
import { DiariesService } from "src/diaries/diaries.service";
import { PaginationQueryInterface } from "src/common/queries/pagination.query";
import { ListReviewsGameFiltersInterface } from "../interfaces/list-reviews-game-filters.interface";
import { ListResponseDto } from "src/common/dto/list-response.dto";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(GameFeelEntity) private readonly gamesFeelsRepository: Repository<GameFeelEntity>,
    @InjectRepository(GameEntity) private readonly gamesRepository: Repository<GameEntity>,
    @InjectRepository(ReviewEntity) private readonly reviewsRepository: Repository<ReviewEntity>,
    private readonly gamesService: GamesService,
    private readonly diaryService: DiariesService,
  ) {}

  async saveNewReview(user: UserEntity, reviewBody: ReviewRequestDto): Promise<SuccessResponseDto> {
    const gameExists = await this.gamesService.checkIfGameExists(reviewBody.game.idS);
    const game: GameEntity = gameExists
      ? await this.gamesRepository.findOne({ idS: reviewBody.game.idS })
      : await this.gamesService.saveNewGame(reviewBody.game);

    const gameFeel = await this.gamesFeelsRepository.save({ gameStatus: reviewBody.gameStatus, game, user });
    const review = await this.reviewsRepository.save({ ...reviewBody, game, user, gameFeel });
    await this.diaryService.saveNewDiary(user, { review: review, game });

    return {
      status: "successful",
    };
  }

  async getGameReviews(
    paginationQuery: PaginationQueryInterface,
    gameIdS: string,
    filters: ListReviewsGameFiltersInterface,
  ): Promise<ListResponseDto<ReviewEntity>> {
    const { take, skip } = paginationQuery;

    const query = this.reviewsRepository
      .createQueryBuilder("review")
      .leftJoin("review.game", "game")
      .skip(skip)
      .take(take)
      .orderBy("review.createdAt", "DESC");

    if (gameIdS) {
      query.andWhere("game.idS = :gameIdS", { gameIdS });
    }

    if (filters.maxRating) {
      query.andWhere("review.rating <= :maxRating", { maxRating: filters.maxRating });
      query.orderBy("review.rating", "DESC");
      if (filters.minRating) {
        query.andWhere("review.rating >= :minRating", { minRating: filters.minRating });
      }
    }

    if (filters.popularity) {
      // query.leftJoin("review.likes", "likes")
      // .select('COUNT(likes.id) as likesCount')
      // .orderBy('likesCount', 'DESC')
      // TODO orderBy < number likes all time
      // orderBy < number likes this week time
    }

    const [items, totalItems] = await query.getManyAndCount();

    return { items, totalItems };
  }
}
