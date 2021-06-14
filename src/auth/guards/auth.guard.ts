import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable, UnauthorizedException } from "@nestjs/common";

import { AuthService } from "../auth.service";
import { ErrorMessages } from "../../utils/error-messages";
import { UserEntity } from "../../users/entity/user.entity";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService, private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authorization = AuthGuard.extractAuthorizationHttp(context);

    const user = await this.authService.verifySessionToken(authorization);

    const allowedRoles = this.reflector.get<string[]>("roles", context.getHandler());

    if (!allowedRoles.includes(user.role)) {
      throw new UnauthorizedException(ErrorMessages.UnauthorizedUser);
    }

    const request: { user: UserEntity } = context.switchToHttp().getRequest();
    request.user = user;

    return true;
  }

  private static extractAuthorizationHttp(context: ExecutionContext): string {
    const request: Request = context.switchToHttp().getRequest();
    return request.headers.authorization;
  }
}
