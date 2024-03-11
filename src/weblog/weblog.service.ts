import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WebLogRepository } from './weblog.repository';
import { WebLogInfoDto } from './weblogInfo.dto';

@Injectable()
export class WebLogService {
  constructor(
    @InjectRepository(WebLogRepository)
    private weblogRepository: WebLogRepository,
  ) {}

  async createLog(webLogInfoDto: WebLogInfoDto) {
    await this.weblogRepository.save(webLogInfoDto);
  }
}
