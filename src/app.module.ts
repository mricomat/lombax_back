import { resolve } from 'path';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ClassSerializerInterceptor, Module, ValidationError, ValidationPipe } from '@nestjs/common';

import { UsersModule } from "./users/users.module";
import { ReviewsModule } from './reviews/reviews.module';
import { GenresModule } from './genres/genres.module';
import { GamesModule } from './games/games.module';
import { GamesFeelsModule } from './gameFeel/gameFeels.module';
import { FollowsModule } from "./follows/follows.module";
import { FilesModuleConfigInterface } from "./files/interfaces/files-module-config.interface";
import { FilesModule } from './files/file.module';
import { FeedModule } from "./feed/feed.module";
import { DiariesModule } from './diaries/diaries.module';
import { ClassValidatorErrorsToValidationExceptionFactory } from './common/pipes/validation-factory.pipe';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AuthModule } from './auth/auth.module';
import { AppService } from "./app.service";
import { AppController } from './app.controller';

const configFiles = resolve(__dirname, "config", "**", "!(*.d).{ts,js}");

const appPipe = (cons: (errors: ValidationError[]) => any) => ({
  provide: APP_PIPE,
  useValue: new ValidationPipe({
    whitelist: true,
    validationError: { target: false, value: false },
    exceptionFactory: cons,
  }),
});

const appInterceptor = <T>(cons: T) => ({
  provide: APP_INTERCEPTOR,
  useClass: cons,
});

@Module({
  imports: [
    ConfigModule.load(configFiles),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get("database") as TypeOrmModuleOptions,
    }),
    FilesModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): FilesModuleConfigInterface => configService.get("aws") as FilesModuleConfigInterface,
    }),
    UsersModule,
    GenresModule,
    GamesFeelsModule,
    GamesModule,
    ReviewsModule,
    DiariesModule,
    FollowsModule,
    FeedModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    appPipe(ClassValidatorErrorsToValidationExceptionFactory),
    appInterceptor(ClassSerializerInterceptor),
    appInterceptor(LoggingInterceptor),
  ],
})
export class AppModule {}
