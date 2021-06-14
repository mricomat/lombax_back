import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { IsNotEmpty, IsString } from "class-validator";

import { UserEntity } from "../users/entity/user.entity";
import { BaseEntityAbstract } from "../common/entities/base-entity.abstract";

@Entity("Refresh-Tokens")
export class RefreshTokenEntity extends BaseEntityAbstract {
  @IsString()
  @IsNotEmpty()
  @Column()
  token: string;

  @OneToOne(() => UserEntity, { cascade: true, onDelete: "CASCADE" })
  @JoinColumn()
  user: UserEntity;
}
