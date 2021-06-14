import { ObjectLiteral, Repository, Connection } from "typeorm";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import { Injectable, ConflictException } from "@nestjs/common";
import axios from "axios";

import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { GameFeelRequestDto } from "./dto/gameFeel-request.dto";
import { ErrorMessages } from "../utils/error-messages";
import { GameFeelEntity } from "./gameFeel.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { GameEntity } from "src/games/game.entity";
import { GamesService } from "src/games/games.service";

@Injectable()
export class GamesFeelsService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(GameFeelEntity) private readonly gamesFeelsRepository: Repository<GameFeelEntity>,
    @InjectRepository(GameEntity) private readonly gamesRepository: Repository<GameEntity>,
    private readonly gamesService: GamesService,
  ) {}

  async saveNewGameFeel(user: UserEntity, gameFeelBody: GameFeelRequestDto): Promise<SuccessResponseDto> {
    console.log(gameFeelBody);
    const gameExists = await this.gamesService.checkIfGameExists(gameFeelBody.game.idS);
    const game: GameEntity = gameExists
      ? await this.gamesRepository.findOne({ idS: gameFeelBody.game.idS })
      : await this.gamesService.saveNewGame(gameFeelBody.game);

    await this.connection.transaction(
      async (entityManager): Promise<GameFeelEntity> => {
        const gamesFeelsTransactionalRepository = entityManager.getRepository(GameFeelEntity);

        const newGameFeel = await gamesFeelsTransactionalRepository.save({ ...gameFeelBody, game, user });

        return newGameFeel;
      },
    );

    return {
      status: "successful",
    };
  }
}
