import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty({ minimum: 4, maximum: 40 })
  @IsString()
  @MinLength(4)
  @MaxLength(40)
  userId: string;

  @ApiProperty({
    minimum: 8,
    maximum: 20,
    description: 'At least 1 capital, 1 small, 1 special character & 1 number',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}/, {
    //^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}
    //^[a-zA-Z0-9]*$
    //Minimum of 8 characters and maximum of 20 characters, at least one uppercase letter, at least one lowercase letter, one number, and at least one special character
    //최소 8 자 및 최대 20 자, 대문자 하나 이상, 소문자 하나, 숫자 하나 및 특수 문자 하나 이상
    message:
      'password accept only this rule(Minimum of 8 characters and maximum of 20 characters, at least one uppercase letter, at least one lowercase letter, one number, and at least one special character)',
  })
  password: string;
}
