import { UsersService } from 'src/users/users.service';
import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { GenreEntity } from 'src/genres/genre.entity';
import { GameFeelEntity } from 'src/gameFeel/gameFeel.entity';
import { FollowEntity } from 'src/follows/follow.entity';
import { DiaryEntity } from "src/diaries/diary.entity";
import { ConfigModule, ConfigService } from "nestjs-config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { forwardRef, Module } from "@nestjs/common";

import { RefreshTokenEntity } from "./refresh-token.entity";
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserEntity } from '../users/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RefreshTokenEntity, GenreEntity, DiaryEntity, ReviewEntity, GameFeelEntity, FollowEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get("jwt") as JwtModuleOptions,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
  exports: [AuthService],
})
export class AuthModule {}
