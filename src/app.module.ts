import { Module } from "@nestjs/common";
import { resolve } from "path";
import { ConfigModule, ConfigService } from "nestjs-config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";

const configFiles = resolve(__dirname, "config", "**", "!(*.d).{ts,js}");

@Module({
  imports: [
    ConfigModule.load(configFiles),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get("database") as TypeOrmModuleOptions,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
