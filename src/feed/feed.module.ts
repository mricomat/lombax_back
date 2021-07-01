import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiaryEntity } from "src/diaries/diary.entity";
import { GameFeelEntity } from "src/gameFeel/gameFeel.entity";
import { GenreEntity } from "src/genres/genre.entity";
import { IGDBService } from "src/igdb/igdb.service";
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { UserEntity } from "src/users/entity/user.entity";

import { AuthModule } from "../auth/auth.module";
import { FeedController } from "./feed.controller";
import { FeedService } from "./feed.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, GenreEntity, ReviewEntity, DiaryEntity, GameFeelEntity]), AuthModule],
  controllers: [FeedController],
  providers: [FeedService, IGDBService],
  exports: [FeedService],
})
export class FeedModule {}
