import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest(err, user, info: Error) {
    this.logger.debug(`User: ${JSON.stringify(user)}`);

    if (info instanceof TokenExpiredError) {
      this.logger.warn('Token expired');
      throw new UnauthorizedException('Token expired', 'TOKEN_EXPIRED');
    }
    if (info instanceof JsonWebTokenError) {
      this.logger.warn('Invalid token');
      throw new UnauthorizedException('Invalid token', 'TOKEN_INVALID');
    }
    if (err || !user) {
      this.logger.warn('Authentication failed', err);
      throw err || new UnauthorizedException();
    }
    return user;
  }
}