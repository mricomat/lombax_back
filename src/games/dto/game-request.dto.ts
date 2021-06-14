import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString } from "class-validator";
import {  Type } from "class-transformer";

export class GameRequestDto {
  @ApiProperty()
  //@Transform(trimStringHelper)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  coverId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  backgroundId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idS: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  releaseDate: Date;
}
