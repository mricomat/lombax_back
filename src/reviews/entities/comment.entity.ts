import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiResponseProperty } from "@nestjs/swagger";

import { LikeEntity } from "./like.entity";
import { UserEntity } from "../../users/entity/user.entity";
import { BaseEntityAbstract } from "../../common/entities/base-entity.abstract";
import { ReviewEntity } from "./review.entity";

@Entity("Comments")
export class CommentEntity extends BaseEntityAbstract {
  @ApiResponseProperty()
  @IsString()
  @IsNotEmpty()
  @Column({ type: "text" })
  text: string;

  @ManyToOne(() => UserEntity, { cascade: true, onDelete: "CASCADE" })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => ReviewEntity, (review) => review.comments, { cascade: true, onDelete: "CASCADE" })
  @JoinColumn()
  review: ReviewEntity;

  @ManyToOne(() => CommentEntity, (comment) => comment.childComments, {
    cascade: true,
    onDelete: "CASCADE",
  })
  parentComment?: CommentEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.parentComment)
  childComments?: CommentEntity[];

  @OneToMany(() => LikeEntity, (like) => like.comment)
  likes: LikeEntity[];

  @ApiResponseProperty()
  totalLikes?: number;
}
