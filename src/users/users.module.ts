import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UserInfoRepository } from './repository/user-info.repository';
import { UsersRepository } from './repository/users.repository';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository, UserInfoRepository])],
  controllers: [UsersController],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
