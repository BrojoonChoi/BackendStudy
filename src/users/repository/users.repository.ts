import { DataSource, Repository } from 'typeorm';
import { TblUser } from 'src/entities/users/TblUsers.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository extends Repository<TblUser> {
  constructor(private dataSource: DataSource) {
    super(TblUser, dataSource.createEntityManager());
  }

  // constructor(@InjectRepository(TblUser) private readonly userRepository: ) {}
  async getUserInfoByUsername(userId: string) {
    const auth = await this.findOne({
      where: {
        userId: userId,
      },
    });
    if (auth) {
      return auth;
    } else {
      return null;
    }
  }
}
