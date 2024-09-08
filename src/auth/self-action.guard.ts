import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class SelfActionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return false;
    }
    if(user.role === 'admin') {
      return true;
    }

    const targetUserId = parseInt(request.params.userId || request.body.userId);
    if (!targetUserId) {
      return true;
    }
    return user.userId === targetUserId;
  }
}