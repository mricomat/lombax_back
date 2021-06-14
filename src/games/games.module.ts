import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GamesController } from "./games.controller";
import { GameEntity } from "./game.entity";
import { GamesService } from "./games.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity]), AuthModule],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
