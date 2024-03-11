import { PartialType } from '@nestjs/mapped-types';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credential.dto';

export class AuthCredentialsSignInDto extends PartialType(AuthCredentialsDto) {}
