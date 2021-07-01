import { UserEntity } from 'src/users/entity/user.entity';
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { IGDBService } from 'src/igdb/igdb.service';
import { GenreEntity } from "src/genres/genre.entity";
import { GameFeelEntity } from 'src/gameFeel/gameFeel.entity';
import { DiaryEntity } from "src/diaries/diary.entity";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { FeedService } from './feed.service';
import { FeedController } from "./feed.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, GenreEntity, ReviewEntity, DiaryEntity, GameFeelEntity]), AuthModule],
  controllers: [FeedController],
  providers: [FeedService, IGDBService],
  exports: [FeedService],
})
export class FeedModule {}
