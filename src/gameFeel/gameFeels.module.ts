import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameFeelsController } from "./gameFeels.controller";
import { GameFeelEntity } from "./gameFeel.entity";
import { GamesFeelsService } from "./gameFeels.service";
import { AuthModule } from "../auth/auth.module";
import { GameEntity } from "src/games/game.entity";
import { GamesModule } from "src/games/games.module";
import { GamesService } from "src/games/games.service";

@Module({
  imports: [TypeOrmModule.forFeature([GameFeelEntity, GameEntity]), AuthModule, GamesModule],
  controllers: [GameFeelsController],
  providers: [GamesFeelsService, GamesService],
})
export class GamesFeelsModule {}
