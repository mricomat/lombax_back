import { UserEntity } from 'src/users/entity/user.entity';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

import { FollowsService } from './follows.service';
import { FollowsController } from "./follows.controller";
import { FollowEntity } from './follow.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([FollowEntity, UserEntity]), AuthModule],
  controllers: [FollowsController],
  providers: [FollowsService],
})
export class FollowsModule {}
