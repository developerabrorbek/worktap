import { ApiProperty } from '@nestjs/swagger';
import { LogoutRequest } from '../interfaces';
import { IsOptional, IsString } from 'class-validator';

export class LogoutDto implements LogoutRequest {
  @ApiProperty()
  @IsString()
  accessToken: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  ip?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  userAgent?: string;
}
