import { ApiResponseProperty } from "@nestjs/swagger";
import { IsOptional, IsNotEmpty, IsNumberString, IsString, IsDate, IsNumber } from "class-validator";
import { Column, Entity, OneToOne, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { BaseEntityAbstract } from "../../common/entities/base-entity.abstract";
import { GameEntity } from "src/games/game.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { IsAlphaBlank } from "../../common/custom-validators/is-alpha-blank.custom-validator";
import { GameFeelEntity } from "src/gameFeel/gameFeel.entity";
import { CommentEntity } from "./comment.entity";
import { LikeEntity } from "./like.entity";

@Entity("Reviews")
export class ReviewEntity extends BaseEntityAbstract {
  @ApiResponseProperty()
  @ManyToOne(() => GameEntity, { cascade: true, onDelete: "CASCADE" })
  @JoinColumn()
  game: GameEntity;

  @ManyToOne(() => UserEntity, (user) => user.reviews, { cascade: true, onDelete: "CASCADE" })
  user: UserEntity;

  @ApiResponseProperty()
  @OneToOne(() => GameFeelEntity, { cascade: true, onDelete: "CASCADE" })
  @JoinColumn()
  gameFeel: GameFeelEntity;

  @ApiResponseProperty()
  @IsString()
  @IsAlphaBlank()
  @Column()
  summary: string;

  @ApiResponseProperty()
  @IsNumber()
  @IsOptional()
  @Column({ nullable: true })
  rating: number;

  @ApiResponseProperty()
  @IsDate()
  @Column({ type: "timestamptz" })
  dateFinished: Date;

  @ApiResponseProperty()
  @IsOptional()
  @IsNumber()
  @Column()
  timeToBeat: number;

  @ApiResponseProperty({ type: [CommentEntity] })
  @OneToMany(() => CommentEntity, (comment) => comment.review)
  comments?: CommentEntity[];

  @ApiResponseProperty({ type: [LikeEntity] })
  @OneToMany(() => LikeEntity, (like) => like.review)
  likes?: LikeEntity[];

  @ApiResponseProperty()
  totalLikes?: number;

  @ApiResponseProperty()
  totalComments?: number;
}