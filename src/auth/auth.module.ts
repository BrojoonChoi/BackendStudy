import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UsersRepository } from 'src/users/repository/users.repository';
import { CachingModule } from '../caching/caching.module';
import { RedisCacheService } from 'src/caching/caching.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    TypeOrmModule.forFeature([UsersRepository]),
    UsersModule,
    CachingModule,
    HttpModule,
  ],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, RedisCacheService],
  controllers: [AuthController],
  exports: [JwtStrategy, JwtRefreshStrategy, PassportModule],
})
export class AuthModule {}
