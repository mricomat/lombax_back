import { ObjectLiteral, Repository, Connection } from "typeorm";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import { Injectable, ConflictException } from "@nestjs/common";
import axios from "axios";

import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { GameEntity } from "./game.entity";
import { GameRequestDto } from "./dto/game-request.dto";
import { ErrorMessages } from "../utils/error-messages";

@Injectable()
export class GamesService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(GameEntity) private readonly gamesRepository: Repository<GameEntity>,
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

  async checkIfGameExists(idS: string): Promise<boolean> {
    const game = await this.gamesRepository.findOne({ idS }, { select: ["idS"] });
    return !!game;
  }
}
