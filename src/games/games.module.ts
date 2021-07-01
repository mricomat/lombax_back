import { UserEntity } from 'src/users/entity/user.entity';
import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { GameFeelEntity } from 'src/gameFeel/gameFeel.entity';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

import { GamesService } from "./games.service";
import { GamesController } from "./games.controller";
import { GameEntity } from "./game.entity";
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity, UserEntity, ReviewEntity, GameFeelEntity]), AuthModule],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
