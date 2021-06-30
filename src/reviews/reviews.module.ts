import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { GameEntity } from "src/games/game.entity";
import { GamesModule } from "src/games/games.module";
import { GamesService } from "src/games/games.service";
import { ReviewsController } from "./controllers/reviews.controller";
import { ReviewsService } from "./services/reviews.service";
import { GameFeelEntity } from "src/gameFeel/gameFeel.entity";
import { ReviewEntity } from "./entities/review.entity";
import { GamesFeelsService } from "src/gameFeel/gameFeels.service";
import { DiariesService } from "src/diaries/diaries.service";
import { FileEntity } from "src/files/file.entity";
import { LikeEntity } from "./entities/like.entity";
import { CommentEntity } from "./entities/comment.entity";
import { CommentsController } from "./controllers/comments.controller";
import { CommentsService } from "./services/comments.service";
import { LikesService } from "./services/likes.service";
import { DiaryEntity } from "src/diaries/diary.entity";

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
