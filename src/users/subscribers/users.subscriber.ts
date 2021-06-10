import { Connection, EntitySubscriberInterface, InsertEvent, UpdateEvent } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { InjectConnection } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UsersSubscriber implements EntitySubscriberInterface<UserEntity> {
  constructor(@InjectConnection() private readonly connection: Connection) {
    this.connection.subscribers.push(this);
  }

  listenTo(): Function | string {
    return UserEntity;
  }

  beforeInsert(event: InsertEvent<UserEntity>): Promise<void> {
    return this.hashPassword(event);
  }

  beforeUpdate(event: UpdateEvent<UserEntity>): Promise<void> {
    if (event.updatedColumns.find((up) => up.propertyName === 'password')) {
      return this.hashPassword(event);
    }
  }

  async hashPassword(event: InsertEvent<UserEntity> | UpdateEvent<UserEntity>): Promise<void> {
    if (event.entity && event.entity.password) {
      const salts = await genSalt();
      event.entity.password = await hash(event.entity.password, salts);
    }
  }
}
