import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';
import { TblUserInfo } from './TblUserInfo.entity';
import * as bcrypt from 'bcryptjs';
import { TimeStampableEntity } from '../common/TimeStampableEntity.entity';

@Entity('tbl_user', { schema: 'supli' })
@Unique(['userId'])
export class TblUser extends TimeStampableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'user_id', length: 40 })
  userId: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({ nullable: true })
  @Exclude()
  public hashedRefreshToken?: string;

  @OneToOne((type) => TblUserInfo, { eager: true })
  @JoinColumn()
  user_info: TblUserInfo;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
