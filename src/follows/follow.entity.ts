import { Entity, ManyToOne } from "typeorm";
import { UserEntity } from "src/users/entity/user.entity";
import { BaseEntityAbstract } from "src/common/entities/base-entity.abstract";

@Entity("Follows")
export class FollowEntity extends BaseEntityAbstract {
  @ManyToOne(() => UserEntity, { cascade: true, onDelete: "CASCADE" })
  requester: UserEntity;

  @ManyToOne(() => UserEntity, { cascade: true, onDelete: "CASCADE" })
  addressee: UserEntity;
}
