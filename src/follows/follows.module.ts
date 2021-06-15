import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/users/entity/user.entity";
import { AuthModule } from "../auth/auth.module";
import { FollowEntity } from "./follow.entity";
import { FollowsController } from "./follows.controller";
import { FollowsService } from "./follows.service";

@Module({
  imports: [TypeOrmModule.forFeature([FollowEntity, UserEntity]), AuthModule],
  controllers: [FollowsController],
  providers: [FollowsService],
})
export class FollowsModule {}
