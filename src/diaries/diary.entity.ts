import { ApiResponseProperty } from "@nestjs/swagger";
import { IsOptional, IsNotEmpty, IsNumberString, IsString, IsDate } from "class-validator";
import { Column, Entity, OneToOne, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { BaseEntityAbstract } from "../common/entities/base-entity.abstract";
import { GameEntity } from "src/games/game.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { GameFeelEntity } from "src/gameFeel/gameFeel.entity";

@Entity("Diaries")
export class DiaryEntity extends BaseEntityAbstract {
  @ApiResponseProperty()
  @ManyToOne(() => GameEntity, { cascade: true, onDelete: "CASCADE" })
  @JoinColumn()
  game: GameEntity;

  @ManyToOne(() => UserEntity, (user) => user.diary, { cascade: true, onDelete: "CASCADE" })
  user: UserEntity;

  @ApiResponseProperty()
  @OneToOne(() => ReviewEntity, { cascade: true, onDelete: "CASCADE" })
  @IsOptional()
  @JoinColumn()
  review: ReviewEntity;

  @ApiResponseProperty()
  @OneToOne(() => GameFeelEntity, { cascade: true, onDelete: "CASCADE" })
  @IsOptional()
  @JoinColumn()
  gameFeel: GameFeelEntity;
}
