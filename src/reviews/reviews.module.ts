import { GamesService } from 'src/games/games.service';
import { GamesModule } from 'src/games/games.module';
import { GameEntity } from "src/games/game.entity";
import { GamesFeelsService } from 'src/gameFeel/gameFeels.service';
import { GameFeelEntity } from 'src/gameFeel/gameFeel.entity';
import { FileEntity } from 'src/files/file.entity';

import { CommentsService } from "./services/comments.service";
import { LikesService } from "./services/likes.service";
import { DiaryEntity } from "src/diaries/diary.entity";
import { DiariesService } from 'src/diaries/diaries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from "@nestjs/common";

import { ReviewsService } from './services/reviews.service';
import { ReviewEntity } from './entities/review.entity';
import { LikeEntity } from "./entities/like.entity";
import { CommentEntity } from "./entities/comment.entity";
import { ReviewsController } from './controllers/reviews.controller';
import { CommentsController } from "./controllers/comments.controller";
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity, GameFeelEntity, GameEntity, FileEntity, LikeEntity, CommentEntity, DiaryEntity]),
    AuthModule,
    GamesModule,
    GameFeelEntity,
  ],
  controllers: [ReviewsController, CommentsController],
  providers: [ReviewsService, CommentsService, LikesService, GamesService, GamesFeelsService, DiariesService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
