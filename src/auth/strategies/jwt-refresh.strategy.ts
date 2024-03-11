import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersRepository } from 'src/users/repository/users.repository';
import * as bcrypt from 'bcryptjs';
import { AuthMessages } from '../enum/auth-messages.enum';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          const cookies = request.headers.cookie;

          if (!cookies) {
            throw new UnauthorizedException(AuthMessages.COOKIE_DOES_NOT_EXIST);
          }
          const refreshToken = request?.cookies?.nestJS_refresh;
          if (!refreshToken) {
            throw new UnauthorizedException(AuthMessages.COOKIE_DOES_NOT_EXIST);
          }
          return refreshToken;
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
  }

  async validate(payload) {
    const { userId } = payload;
    const user = await this.usersRepository.findOne({
      where: {
        userId: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
