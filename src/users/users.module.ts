import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "nestjs-config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "./entity/user.entity";
import { UsersSubscriber } from "./subscribers/users.subscriber";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { DiaryEntity } from "src/diaries/diary.entity";
import { GameFeelEntity } from "src/gameFeel/gameFeel.entity";
import { ReviewEntity } from "src/reviews/review.entity";
import { FollowEntity } from "src/follows/follow.entity";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, DiaryEntity, GameFeelEntity, ReviewEntity, FollowEntity]),
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get("jwt") as JwtModuleOptions,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersSubscriber],
  exports: [UsersService],
})
export class UsersModule {}
