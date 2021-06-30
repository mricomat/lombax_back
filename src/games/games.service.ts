import { ObjectLiteral, Repository, Connection, Brackets } from "typeorm";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import { Injectable, ConflictException } from "@nestjs/common";
import axios from "axios";

import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { GameEntity } from "./game.entity";
import { GameRequestDto } from "./dto/game-request.dto";
import { ErrorMessages } from "../utils/error-messages";
import { UserEntity } from "src/users/entity/user.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { GameFeelEntity } from "src/gameFeel/gameFeel.entity";
import { GetAvgRatingGameDto } from "./dto/get-avg-rating-game.dto";
import { GetAvgTimeToBeatGameDto } from "./dto/get-avg-timeToBeat-game.dto";
import { GetGameInfoDto } from "./dto/get-game-info.dto";

@Injectable()
export class GamesService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(GameEntity) private readonly gamesRepository: Repository<GameEntity>,
    @InjectRepository(ReviewEntity) private readonly reviewsRepository: Repository<ReviewEntity>,
    @InjectRepository(GameFeelEntity) private readonly gameFeelRepository: Repository<GameFeelEntity>,
  ) {}

  async saveNewGame(gameBody: GameRequestDto): Promise<GameEntity> {
    const { idS } = gameBody;
    const gameExists = await this.checkIfGameExists(idS);

    if (gameExists) {
      throw new ConflictException(ErrorMessages.gameAlreadyExists);
    }
    const newGame = await this.connection.transaction(
      async (entityManager): Promise<GameEntity> => {
        const gamesTransactionalRepository = entityManager.getRepository(GameEntity);

        const newGame = await gamesTransactionalRepository.save({ ...gameBody });

        return newGame;
      },
    );

    return {
      ...newGame,
    };
  }

  async getGameInfo(user: UserEntity, gameIdS: string): Promise<GetGameInfoDto> {
    const lastReview = await this.getLastReviewGameUser(user, gameIdS);
    const lastGameFeel = await this.getLastGameFeelGameUser(user, gameIdS);
    const ratingInfo = await this.getAVGRatingOfGame(user, gameIdS);
    const timeToBeatInfo = await this.getAVGTimeToBeatOfGame(user, gameIdS);

    return {
      lastReview,
      lastGameFeel,
      ratingInfo,
      timeToBeatInfo,
    };
  }

  private async getLastReviewGameUser(user: UserEntity, gameIdS: string): Promise<ReviewEntity> {
    return await this.reviewsRepository
      .createQueryBuilder("review")
      .leftJoin("review.game", "game")
      .where("review.user = :userId", { userId: user.id })
      .andWhere("game.idS = :gameIdS", { gameIdS })
      .andWhere("review.rating is not null")
      .orderBy("review.createdAt", "DESC")
      .getOne();
  }

  private async getLastGameFeelGameUser(user: UserEntity, gameIdS: string): Promise<GameFeelEntity> {
    return await this.gameFeelRepository
      .createQueryBuilder("gameFeel")
      .leftJoin("gameFeel.game", "game")
      .where("gameFeel.user = :userId", { userId: user.id })
      .andWhere("game.idS = :gameIdS", { gameIdS })
      .orderBy("gameFeel.createdAt", "DESC")
      .getOne();
  }

  private async getAVGRatingOfGame(user: UserEntity, gameIdS: string): Promise<GetAvgRatingGameDto> {
    const { totalRating, numOfReviews } = await this.reviewsRepository
      .createQueryBuilder("review")
      .select('COUNT(DISTINCT review.id) AS "numOfReviews", COALESCE(AVG(review.rating), 0) AS "totalRating"')
      .leftJoin("review.game", "game")
      .where("review.user = :userId", { userId: user.id })
      .andWhere("game.idS = :gameIdS", { gameIdS })
      .andWhere("review.rating is not null")
      .getRawOne();
    return { rating: Number.parseInt(totalRating, 10), numOfReviews };
  }

  private async getAVGTimeToBeatOfGame(user: UserEntity, gameIdS: string): Promise<GetAvgTimeToBeatGameDto> {
    const { numOfReviews, totalTimeToBeat } = await this.reviewsRepository
      .createQueryBuilder("review")
      .select('COUNT(DISTINCT review.id) AS "numOfReviews", COALESCE(AVG(review.timeToBeat), 0) AS "totalTimeToBeat"')
      .leftJoin("review.game", "game")
      .where("review.user = :userId", { userId: user.id })
      .andWhere("game.idS = :gameIdS", { gameIdS })
      .andWhere("review.timeToBeat is not null")
      .getRawOne();
    return { timeToBeat: Number.parseInt(totalTimeToBeat, 10), numOfReviews };
  }

  async checkIfGameExists(idS: string): Promise<boolean> {
    const game = await this.gamesRepository.findOne({ idS }, { select: ["idS"] });
    return !!game;
  }
}
