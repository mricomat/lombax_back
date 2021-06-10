import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "nestjs-config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "./entity/user.entity";
import { UsersSubscriber } from "./subscribers/users.subscriber";
import { UsersService } from "./users.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get("jwt") as JwtModuleOptions,
    }),
  ],
  controllers: [],
  providers: [UsersSubscriber],
  exports: [],
})
export class UsersModule {}
