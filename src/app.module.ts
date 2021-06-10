import { ClassSerializerInterceptor, Module, ValidationError, ValidationPipe } from "@nestjs/common";
import { resolve } from "path";
import { ConfigModule, ConfigService } from "nestjs-config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ClassValidatorErrorsToValidationExceptionFactory } from "./common/pipes/validation-factory.pipe";
import { UsersModule } from "./users/users.module";

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
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, appPipe(ClassValidatorErrorsToValidationExceptionFactory), appInterceptor(ClassSerializerInterceptor)],
})
export class AppModule {}
