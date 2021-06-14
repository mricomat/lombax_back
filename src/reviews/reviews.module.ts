import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { GameEntity } from "src/games/game.entity";
import { GamesModule } from "src/games/games.module";
import { GamesService } from "src/games/games.service";
import { ReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";
import { GameFeelEntity } from "src/gameFeel/gameFeel.entity";
import { ReviewEntity } from "./review.entity";
import { GamesFeelsService } from "src/gameFeel/gameFeels.service";
import { DiariesService } from "src/diaries/diaries.service";

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity, GameFeelEntity, GameEntity]), AuthModule, GamesModule, GameFeelEntity],
  controllers: [ReviewsController],
  providers: [ReviewsService, GamesService, GamesFeelsService, DiariesService],
})
export class ReviewsModule {}
