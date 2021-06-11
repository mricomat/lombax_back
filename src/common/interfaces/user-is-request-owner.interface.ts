import { UserEntity } from '../../users/entity/user.entity';

export interface UserIsRequestOwnerInterface {
  params: {
    userId: string;
  };
  user: UserEntity;
}
