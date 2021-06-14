import { ApiResponseProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { Column, Entity } from "typeorm";
import { BaseEntityAbstract } from "../common/entities/base-entity.abstract";

@Entity("Games")
export class GameEntity extends BaseEntityAbstract {
  @ApiResponseProperty()
  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiResponseProperty()
  @IsString()
  @IsNotEmpty()
  @Column()
  coverId: string;

  @ApiResponseProperty()
  @IsString()
  @IsNotEmpty()
  @Column()
  backgroundId: string;

  @ApiResponseProperty()
  @IsString()
  @IsNotEmpty()
  @Column()
  idS: string;

  @ApiResponseProperty()
  @IsDate()
  @IsNotEmpty()
  @Column({ type: "timestamptz", nullable: true })
  releaseDate: Date;
}
