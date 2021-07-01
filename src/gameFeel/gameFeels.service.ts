import { Repository } from 'typeorm';
import { UserEntity } from "src/users/entity/user.entity";
import { GamesService } from 'src/games/games.service';
import { GameEntity } from "src/games/game.entity";
import { DiariesService } from 'src/diaries/diaries.service';
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

import { GameFeelEntity } from './gameFeel.entity';
import { GameFeelRequestDto } from "./dto/gameFeel-request.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";

@Injectable()
export class GamesFeelsService {
  constructor(
    @InjectRepository(GameFeelEntity) private readonly gamesFeelsRepository: Repository<GameFeelEntity>,
    @InjectRepository(GameEntity) private readonly gamesRepository: Repository<GameEntity>,
    private readonly gamesService: GamesService,
    private readonly diaryService: DiariesService,
  ) {}

  async saveNewGameFeel(user: UserEntity, gameFeelBody: GameFeelRequestDto): Promise<SuccessResponseDto> {
    console.log(gameFeelBody);
    const gameExists = await this.gamesService.checkIfGameExists(gameFeelBody.game.idS);
    const game: GameEntity = gameExists
      ? await this.gamesRepository.findOne({ idS: gameFeelBody.game.idS })
      : await this.gamesService.saveNewGame(gameFeelBody.game);

    const newGameFeel = await this.gamesFeelsRepository.save({ ...gameFeelBody, game, user });
    await this.diaryService.saveNewDiary(user, { gameFeel: newGameFeel, game });

    return {
      status: "successful",
    };
  }
}
