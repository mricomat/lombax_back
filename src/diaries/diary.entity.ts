import { Column, Entity, OneToOne, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { UserEntity } from "src/users/entity/user.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { GameEntity } from "src/games/game.entity";
import { GameFeelEntity } from 'src/gameFeel/gameFeel.entity';
import { IsOptional, IsNotEmpty, IsNumberString, IsString, IsDate } from 'class-validator';
import { ApiResponseProperty } from "@nestjs/swagger";

import { BaseEntityAbstract } from '../common/entities/base-entity.abstract';

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
