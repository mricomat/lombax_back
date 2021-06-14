import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { GameEntity } from "src/games/game.entity";
import { GamesModule } from "src/games/games.module";
import { GamesService } from "src/games/games.service";
import { DiaryEntity } from "./diary.entity";
import { ReviewEntity } from "src/reviews/review.entity";
import { GamesFeelsModule } from "src/gameFeel/gameFeels.module";
import { ReviewsModule } from "src/reviews/reviews.module";
import { DiariesController } from "./diaries.controller";
import { DiariesService } from "./diaries.service";
import { GameFeelEntity } from "src/gameFeel/gameFeel.entity";

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
