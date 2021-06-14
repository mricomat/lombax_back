import { ApiResponseProperty } from "@nestjs/swagger";
import { IsOptional, IsNotEmpty, IsNumberString, IsString, IsDate } from "class-validator";
import { Column, Entity, OneToOne, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntityAbstract } from "../common/entities/base-entity.abstract";
import { GameEntity } from "src/games/game.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { IsAlphaBlank } from "../common/custom-validators/is-alpha-blank.custom-validator";

@Entity("Reviews")
export class ReviewEntity extends BaseEntityAbstract {
  @ApiResponseProperty()
  @ManyToOne(() => GameEntity, { cascade: true, onDelete: "CASCADE" })
  @JoinColumn()
  game: GameEntity;

  @ManyToOne(() => UserEntity, (user) => user.gameFeels, { cascade: true, onDelete: "CASCADE" })
  user: UserEntity;

  @ApiResponseProperty()
  @IsString()
  @IsAlphaBlank()
  @Column()
  summary: string;

  @ApiResponseProperty()
  @IsOptional()
  @IsString()
  @IsNumberString()
  @Column()
  rating: string;

  @ApiResponseProperty()
  @IsDate()
  @Column({ type: "timestamptz" })
  dateFinished: Date;

  @ApiResponseProperty()
  @IsOptional()
  @IsString()
  @IsNumberString()
  @Column()
  timeToBeat: string;
}
