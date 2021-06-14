import { ObjectLiteral, Repository, Connection } from "typeorm";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import { Injectable, ConflictException } from "@nestjs/common";

import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { GameFeelEntity } from "../gameFeel/gameFeel.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { GameEntity } from "src/games/game.entity";
import { GamesService } from "src/games/games.service";
import { ReviewEntity } from "./review.entity";
import { ReviewRequestDto } from "./dto/review-request.dto";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(GameFeelEntity) private readonly gamesFeelsRepository: Repository<GameFeelEntity>,
    @InjectRepository(GameEntity) private readonly gamesRepository: Repository<GameEntity>,
    private readonly gamesService: GamesService,
  ) {}

  async saveNewReview(user: UserEntity, reviewBody: ReviewRequestDto): Promise<SuccessResponseDto> {
    const gameExists = await this.gamesService.checkIfGameExists(reviewBody.game.idS);
    const game: GameEntity = gameExists
      ? await this.gamesRepository.findOne({ idS: reviewBody.game.idS })
      : await this.gamesService.saveNewGame(reviewBody.game);

    await this.connection.transaction(
      async (entityManager): Promise<ReviewEntity> => {
        await this.gamesFeelsRepository.save({ gameStatus: reviewBody.gameStatus, game, user });

        const reviewsTransactionalRepository = entityManager.getRepository(ReviewEntity);
        const newGameFeel = await reviewsTransactionalRepository.save({ ...reviewBody, game, user });

        return newGameFeel;
      },
    );

    return {
      status: "successful",
    };
  }
}
