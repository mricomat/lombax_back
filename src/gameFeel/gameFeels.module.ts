import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { GamesService } from "src/games/games.service";
import { GamesModule } from 'src/games/games.module';
import { GameEntity } from "src/games/game.entity";
import { DiaryEntity } from "src/diaries/diary.entity";
import { DiariesService } from 'src/diaries/diaries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { GamesFeelsService } from './gameFeels.service';
import { GameFeelsController } from './gameFeels.controller';
import { GameFeelEntity } from './gameFeel.entity';
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([GameFeelEntity, GameEntity, DiaryEntity, ReviewEntity]), AuthModule, GamesModule],
  controllers: [GameFeelsController],
  providers: [GamesFeelsService, GamesService, DiariesService],
})
export class GamesFeelsModule {}
