import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimeStampableEntity } from 'src/entities/common/TimeStampableEntity.entity';

@Entity('tbl_web_log_info', { schema: 'wais' })
export class TblWebLogInfo extends TimeStampableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: true, name: 'method', length: 40 })
  method: string;

  @Column('varchar', { nullable: true, name: 'statusCode', length: 3 })
  statusCode: string;

  @Column('varchar', { nullable: true, name: 'originalUrl', length: 200 })
  originalUrl: string;

  @Column('varchar', { nullable: true, name: 'ip', length: 20 })
  ip: string;

  @Column('varchar', { nullable: true, name: 'userAgent', length: 300 })
  userAgent: string;
}
