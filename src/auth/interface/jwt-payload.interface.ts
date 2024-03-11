import { TblUserInfo } from 'src/entities/users/TblUserInfo.entity';

export interface JwtPayload {
  userId: string;
  user_info: TblUserInfo;
}
