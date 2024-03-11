import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TblUser } from '../../entities/users/TblUsers.entity';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext): TblUser => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
