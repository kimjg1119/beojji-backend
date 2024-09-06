import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info: Error) {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Token expired', 'TOKEN_EXPIRED');
    }
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid token', 'TOKEN_INVALID');
    }
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}