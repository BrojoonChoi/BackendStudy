import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimeStampableEntity } from 'src/entities/common/TimeStampableEntity.entity';
import { TblUser } from './TblUsers.entity';

@Entity('tbl_user_info', { schema: 'wais' })
export class TblUserInfo extends TimeStampableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: true, name: 'user_email', length: 40 })
  userEmail: string;

  @Column('varchar', { nullable: true, name: 'user_role', length: 10 })
  userRole: string;
}
