import { ConfigModule, ConfigService } from "nestjs-config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { forwardRef, Module } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserEntity } from "../users/entity/user.entity";
import { GenreEntity } from "src/genres/genre.entity";
import { RefreshTokenEntity } from "./refresh-token.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RefreshTokenEntity, GenreEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get("jwt") as JwtModuleOptions,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
