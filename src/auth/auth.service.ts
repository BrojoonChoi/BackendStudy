import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsSignInDto } from './dto/auth-credential-signin.dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { TblUser } from 'src/entities/users/TblUsers.entity';
import { AccessOption } from './interface/access-token.interface';
import { AuthMessages } from './enum/auth-messages.enum';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService, private readonly httpService: HttpService) {}

  async signUp(authCredentialsDto: AuthCredentialsSignInDto): Promise<{ message: string }> {
    return this.usersService.createUser(authCredentialsDto);
  }

  async checkId(): Promise<any> {
    try {
      const sso_server_url: string = 'http://' + process.env.SSO_SERVER_HOST + ':' + process.env.SSO_SERVER_PORT;
      // const result = await this.httpService.get(sso_server_url + '/chkId?sysId=wais').toPromise();
      const result = await this.httpService.get(sso_server_url + '/chkId?sysId=wais').pipe(map((response) => response.data));

      // console.log(result);
      // console.log(result.data);
      return result;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async signIn(authCredentialsSignInDto: AuthCredentialsSignInDto): Promise<{
    accessToken: string;
    accessOption: AccessOption;
    refreshToken: string;
    refreshOption: AccessOption;
    user: JwtPayload;
  }> {
    const resp = await this.usersService.validateUserPassword(authCredentialsSignInDto);

    if (!resp) {
      throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIAL);
    }

    const { accessToken, ...accessOption } = await this.getAccessToken(resp);
    const { refreshToken, ...refreshOption } = await this.getRefreshToken(resp);

    await this.usersService.updateRefreshTokenInUser(refreshToken, resp.userId);

    return {
      accessToken: accessToken,
      accessOption: accessOption,
      refreshToken: refreshToken,
      refreshOption: refreshOption,
      user: resp,
    };
  }

  // async findSSOUserId(): Promise<any> {
  //   const response = await this.httpService.axiosRef({
  //     url: 'http://local.lgensol.com:8080/chkLogin',
  //     method: 'GET',
  //     responseType: 'json',
  //     headers: {
  //       'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
  //       'User-Agent': 'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36',
  //     },
  //   });
  //   console.log('response,' + response);
  //   const result = await this.httpService.axiosRef.get('http://local.lgensol.com:8080/chkLogin', { withCredentials: true });
  //   console.log('result,' + result.toString());
  //   // console.log("result,"+ result.data);
  //   // console.log('result,' + result.status);
  //   return result;
  // }
  // async ssoSetAccessToken(authCredentialsSignInDto: AuthCredentialsSignInDto): Promise<{
  //   accessToken: string;
  //   accessOption: AccessOption;
  //   refreshToken: string;
  //   refreshOption: AccessOption;
  //   user: JwtPayload;
  // }> {

  //   const { userId, password } = authCredentialsSignInDto;

  //   const resp = {
  //       userId: userId,
  //       user_info: user_info,
  //     }

  //   if (!resp) {
  //     throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIAL);
  //   }

  //   const user = await this.findOne(userId);

  //   if (user && (await user.validatePassword(password))) {
  //     return ;

  //   const { accessToken, ...accessOption } = await this.getAccessToken(resp);
  //   const { refreshToken, ...refreshOption } = await this.getRefreshToken(resp);

  //   await this.usersService.updateRefreshTokenInUser(refreshToken, resp.userId);

  //   return {
  //     accessToken: accessToken,
  //     accessOption: accessOption,
  //     refreshToken: refreshToken,
  //     refreshOption: refreshOption,
  //     user: resp,
  //   };
  // }

  async ssoSignIn(authCredentialsSignInDto: AuthCredentialsSignInDto): Promise<{
    accessToken: string;
    accessOption: AccessOption;
    refreshToken: string;
    refreshOption: AccessOption;
    user: JwtPayload;
  }> {
    const resp = await this.usersService.validateUserPassword(authCredentialsSignInDto);

    if (!resp) {
      return {
        accessToken: null,
        accessOption: null,
        refreshToken: null,
        refreshOption: null,
        user: resp,
      };
      // return null;
    }

    const { accessToken, ...accessOption } = await this.getAccessToken(resp);
    const { refreshToken, ...refreshOption } = await this.getRefreshToken(resp);

    await this.usersService.updateRefreshTokenInUser(refreshToken, resp.userId);

    return {
      accessToken: accessToken,
      accessOption: accessOption,
      refreshToken: refreshToken,
      refreshOption: refreshOption,
      user: resp,
    };
  }

  async signOut(user: TblUser) {
    await this.usersService.updateRefreshTokenInUser(null, user.userId);
  }

  async getAccessToken(payload: JwtPayload) {
    // const access_token = await this.jwtService.sign(payload);
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIREIN,
    });

    return {
      accessToken: accessToken,
      domain: process.env.SERVER_IP,
      path: '/',
      httpOnly: true,
    };
  }

  async signIn_old(authCredentialsSignInDto: AuthCredentialsSignInDto): Promise<{ access_token: string }> {
    const { userId, password } = authCredentialsSignInDto;
    const user = await this.usersService.findOne(userId);
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { userId };
      const access_token = await this.jwtService.sign(payload);
      return { access_token };
    } else {
      throw new UnauthorizedException(AuthMessages.LOG_IN_FAILED);
    }
  }

  async getRefreshToken(payload: JwtPayload) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIREIN,
    });

    return {
      refreshToken: refreshToken,
      domain: process.env.SERVER_IP,
      path: '/',
      httpOnly: true,
    };
  }

  async getNewAccessAndRefreshToken(payload: JwtPayload) {
    const { refreshToken, ...refreshOption } = await this.getRefreshToken(payload);

    await this.usersService.updateRefreshTokenInUser(refreshToken, payload.userId);

    const { accessToken, ...accessOption } = await this.getAccessToken(payload);

    return {
      accessToken: accessToken,
      accessOption: accessOption,
      refreshToken: refreshToken,
      refreshOption: refreshOption,
      user: payload,
    };
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string): Promise<TblUser> {
    return await this.usersService.getUserIfRefreshTokenMatches(refreshToken, userId);
  }
}
