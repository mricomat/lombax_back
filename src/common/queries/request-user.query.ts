import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserIsRequestOwnerInterface } from '../interfaces/user-is-request-owner.interface';
import { UserEntity } from '../../users/entity/user.entity';

export const requestUserQueryParamFactory = (_: void, ctx: ExecutionContext): UserEntity => {
  const request = ctx.switchToHttp().getRequest<UserIsRequestOwnerInterface>();

  return request.user;
};

export const RequestUserQuery = createParamDecorator(requestUserQueryParamFactory);
