import { ReviewsModule } from 'src/reviews/reviews.module';
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { GamesService } from "src/games/games.service";
import { GamesModule } from 'src/games/games.module';
import { GameEntity } from "src/games/game.entity";
import { GamesFeelsModule } from "src/gameFeel/gameFeels.module";
import { GameFeelEntity } from 'src/gameFeel/gameFeel.entity';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

import { DiaryEntity } from "./diary.entity";
import { DiariesService } from "./diaries.service";
import { DiariesController } from './diaries.controller';
import { AuthModule } from "../auth/auth.module";


@Module({
  imports: [
    TypeOrmModule.forFeature([DiaryEntity, ReviewEntity, GameFeelEntity, GameEntity]),
    AuthModule,
    GamesModule,
    GamesFeelsModule,
    ReviewsModule,
  ],
  controllers: [DiariesController],
  providers: [DiariesService, GamesService],
})
export class DiariesModule {}
