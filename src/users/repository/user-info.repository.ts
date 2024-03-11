import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TblUserInfo } from '../../entities/users/TblUserInfo.entity';

@Injectable()
export class UserInfoRepository extends Repository<TblUserInfo> {
  constructor(private dataSource: DataSource) {
    super(TblUserInfo, dataSource.createEntityManager());
  }
}
