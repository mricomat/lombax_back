import { ConfigModule, ConfigService } from 'nestjs-config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { GenresService } from "./genres.service";
import { GenreController } from "./genres.controller";
import { GenreEntity } from "./genre.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([GenreEntity]), AuthModule],
  controllers: [GenreController],
  providers: [GenresService],
})
export class GenresModule {}
