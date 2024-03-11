import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NextFunction } from 'express';
import { WebLogRepository } from './weblog.repository';
import { WebLogService } from './weblog.service';

@Module({
  imports: [TypeOrmModule.forFeature([WebLogRepository])],
  providers: [WebLogService],
})
export class WebLogModule {}
