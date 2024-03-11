import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class WebLogInfoDto {
  @ApiProperty({ maximum: 40 })
  @IsString()
  @MaxLength(40)
  method: string;

  @ApiProperty({ maximum: 3 })
  @IsString()
  @MaxLength(3)
  statusCode: string;

  @ApiProperty({ maximum: 100 })
  @IsString()
  @MaxLength(100)
  originalUrl: string;

  @ApiProperty({ maximum: 15 })
  @IsString()
  @MaxLength(15)
  ip: string;

  @ApiProperty({ maximum: 300 })
  @IsString()
  @MaxLength(300)
  userAgent: string;
}
