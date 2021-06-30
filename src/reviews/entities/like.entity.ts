import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CommentEntity } from './comment.entity';
import { UserEntity } from '../../users/entity/user.entity';
import { BaseEntityAbstract } from '../../common/entities/base-entity.abstract';
import { ReviewEntity } from './review.entity';

@Entity('Likes')
export class LikeEntity extends BaseEntityAbstract {
  @ManyToOne(() => UserEntity, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => ReviewEntity, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  review?: ReviewEntity;

  @ManyToOne(() => CommentEntity, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  comment?: CommentEntity;
}
