import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsSignInDto } from 'src/auth/dto/auth-credential-signin.dto';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credential.dto';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';
import { TblUser } from 'src/entities/users/TblUsers.entity';
import { UsersRepository } from './repository/users.repository';
import * as bcrypt from 'bcryptjs';
import { UserInfoRepository } from './repository/user-info.repository';
import { TblUserInfo } from 'src/entities/users/TblUserInfo.entity';
import { AuthMessages } from '../auth/enum/auth-messages.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private userInfoRepository: UserInfoRepository,
  ) {}

  async createUser(authCredentialsDto: AuthCredentialsSignInDto): Promise<{ message: string }> {
    const { userId, password } = authCredentialsDto;

    const user = new TblUser();
    user.userId = userId;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      const userInfo = new TblUserInfo();
      userInfo.userRole = '1';
      await this.userInfoRepository.save(userInfo);
      user.user_info = userInfo;
      await this.usersRepository.save(user);
      return { message: AuthMessages.USER_SUCCESSFULLY_CREATED };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Existing user');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async validateUserPassword(authCredentialsSignInDto: AuthCredentialsSignInDto): Promise<JwtPayload> {
    const { userId, password } = authCredentialsSignInDto;
    const user = await this.findOne(userId);

    if (user && (await user.validatePassword(password))) {
      return {
        userId: user.userId,
        user_info: user.user_info,
      };
    } else {
      return null;
    }
  }

  async findOne(userId: string): Promise<TblUser> {
    const found = this.usersRepository.findOne({
      where: {
        userId: userId,
      },
    });

    if (!found) {
      throw new NotFoundException(AuthMessages.CANT_FIND_ID_WITH_ID);
    }
    return found;
  }

  async updateRefreshTokenInUser(refreshToken, userId) {
    if (refreshToken) {
      refreshToken = await bcrypt.hash(refreshToken, 10);
    }

    await this.usersRepository.update(
      { userId: userId },
      {
        hashedRefreshToken: refreshToken,
      },
    );
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string): Promise<TblUser> {
    const user = await this.usersRepository.getUserInfoByUsername(userId);
    if (user.hashedRefreshToken == null) {
      throw new UnauthorizedException();
    }
    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.hashedRefreshToken);

    if (isRefreshTokenMatching) {
      await this.updateRefreshTokenInUser(null, userId);
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}
