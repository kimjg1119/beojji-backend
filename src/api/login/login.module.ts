import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from '../../auth/constants';
import { JwtStrategy } from '../../auth/jwt.strategy';
import { UserModule } from '../user/user.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' }, 
    }),
  ],
  providers: [LoginService, JwtStrategy],
  controllers: [LoginController],
  exports: [LoginService],
})
export class LoginModule {}