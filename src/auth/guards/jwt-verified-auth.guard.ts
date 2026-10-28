import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { User } from '../../users/entities/user.entity.js';

@Injectable()
export class JwtVerifiedAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (!(user as User).isActive) {
      throw new ForbiddenException({
        message: 'Account has not been setup yet!',
      });
    }

    return user;
  }
}
