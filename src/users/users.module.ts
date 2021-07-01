import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { GameFeelEntity } from "src/gameFeel/gameFeel.entity";
import { FollowEntity } from 'src/follows/follow.entity';
import { DiaryEntity } from "src/diaries/diary.entity";
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule, ConfigService } from "nestjs-config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { Module } from "@nestjs/common";

import { UsersService } from "./users.service";
import { UsersController } from './users.controller';
import { UsersSubscriber } from "./subscribers/users.subscriber";
import { UserEntity } from "./entity/user.entity";

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
