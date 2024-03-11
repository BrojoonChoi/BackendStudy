import { Controller, Post, ValidationPipe, Body, Get, UseGuards, Res, Req, Redirect, Query, CacheTTL } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthCredentialsSignInDto } from './dto/auth-credential-signin.dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { TblUser } from '../entities/users/TblUsers.entity';
import { JwtAuthRefreshGuard } from './guards/jwt-auth-refresh.guard';
import { GetUser } from './decorator/get-user.decorator';
import { Public } from './decorator/auth-skip.decorators';
import { Request } from 'express';
import { RedisCacheService } from 'src/caching/caching.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private cachingManager: RedisCacheService) {}

  private userRoleOption: {} = { domain: process.env.SERVER_IP, path: '/', httpOnly: false };

  @Public()
  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ message: string }> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Public()
  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) authCredentialsSignInDto: AuthCredentialsSignInDto,
    @Res({ passthrough: true }) res,
  ): Promise<{ accessToken: string; refreshToken: string; user: JwtPayload }> {
    const { accessToken, accessOption, refreshToken, refreshOption, user } = await this.authService.signIn(authCredentialsSignInDto);

    res.cookie('nestJS_access', accessToken, accessOption);
    res.cookie('nestJS_refresh', refreshToken, refreshOption);
    const userRole = user.user_info.userRole;
    res.cookie('nestJS_userRole', userRole, this.userRoleOption);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  @ApiCookieAuth()
  @Get('/logout')
  logout(@GetUser() user: TblUser, @Res() res) {
    this.authService.signOut(user);
    res.cookie('nestJS_access', '', '');
    res.cookie('nestJS_refresh', '', '');
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthRefreshGuard)
  @Post('/refresh-token')
  async refreshToken(
    @GetUser() user: TblUser,
    @Req() req,
    @Res({ passthrough: true }) res,
  ): Promise<{ accessToken: string; refreshToken: string; user: JwtPayload }> {
    const refreshToken = req.cookies?.nestJS_refresh;
    const user_info = await this.authService.getUserIfRefreshTokenMatches(refreshToken, user.userId);

    if (user_info) {
      const userInfo = {
        userId: user_info.userId,
        user_info: user_info.user_info,
      };

      const { accessToken, accessOption, refreshToken, refreshOption, user } = await this.authService.getNewAccessAndRefreshToken(userInfo);

      res.cookie('nestJS_access', accessToken, accessOption);
      res.cookie('nestJS_refresh', refreshToken, refreshOption);
      const userRole = user.user_info.userRole;
      res.cookie('nestJS_userRole', userRole, this.userRoleOption);

      return {
        accessToken,
        refreshToken,
        user,
      };
    } else {
      return null;
    }
  }
}
