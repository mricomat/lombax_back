import { Column, Entity, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from 'src/users/entity/user.entity';
import { GameEntity } from 'src/games/game.entity';
import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { ApiResponseProperty } from "@nestjs/swagger";

import { GameStatusEnum } from './enum/gameStatus.enum';
import { BaseEntityAbstract } from '../common/entities/base-entity.abstract';

@Entity("GamesFeels")
export class GameFeelEntity extends BaseEntityAbstract {
  @ApiResponseProperty()
  @ManyToOne(() => GameEntity, { cascade: true, onDelete: "CASCADE" })
  @JoinColumn()
  game: GameEntity;

  @ApiResponseProperty()
  @IsString()
  @IsNotEmpty()
  @Column()
  gameStatus: GameStatusEnum;

  @ManyToOne(() => UserEntity, (user) => user.gameFeels, { cascade: true, onDelete: "CASCADE" })
  user: UserEntity;
}
