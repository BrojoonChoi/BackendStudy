import { TblWebLogInfo } from 'src/entities/log/TblWebLogInfo.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(TblWebLogInfo)
export class WebLogRepository extends Repository<TblWebLogInfo> {}
