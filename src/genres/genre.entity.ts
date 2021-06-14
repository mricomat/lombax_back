import { Column, Entity } from "typeorm";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ApiResponseProperty } from "@nestjs/swagger";

import { GenreTypeEnum } from "./enum/genre-type.enum";
import { BaseEntityAbstract } from "../common/entities/base-entity.abstract";

@Entity("Genres")
export class GenreEntity extends BaseEntityAbstract {
  @ApiResponseProperty()
  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiResponseProperty()
  @IsString()
  @IsNotEmpty()
  @Column()
  slug: string;

  @ApiResponseProperty()
  @IsString()
  @IsNotEmpty()
  @Column()
  idS: string;

  @ApiResponseProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(GenreTypeEnum)
  @Column({ enum: GenreTypeEnum })
  type: GenreTypeEnum;
}
