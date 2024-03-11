import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TblUser } from 'src/entities/users/TblUsers.entity';
import { UsersRepository } from 'src/users/repository/users.repository';
import { AuthMessages } from '../enum/auth-messages.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          const cookies = request.headers.cookie;

          if (!cookies) {
            throw new UnauthorizedException(AuthMessages.COOKIE_DOES_NOT_EXIST);
          }
          const accessToken = request?.cookies?.nestJS_access;
          if (!accessToken) {
            throw new UnauthorizedException(AuthMessages.COOKIE_DOES_NOT_EXIST);
          }
          return accessToken;
        },
      ]),
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    const { userId } = payload;
    const user: TblUser = await this.userRepository.findOne({
      where: {
        userId: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException(AuthMessages.USER_DOES_NOT_EXIST);
    }

    return user;
  }
}
