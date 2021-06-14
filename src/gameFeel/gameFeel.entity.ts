import { ApiResponseProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, OneToOne, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntityAbstract } from "../common/entities/base-entity.abstract";
import { GameEntity } from "src/games/game.entity";
import { GameStatusEnum } from "./enum/gameStatus.enum";
import { UserEntity } from "src/users/entity/user.entity";

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
