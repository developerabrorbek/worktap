import { IsOptional, IsString } from 'class-validator';
import { RefreshRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto implements Omit<RefreshRequest, 'refreshToken'> {
  @ApiProperty()
  @IsString()
  @IsOptional()
  ip?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  userAgent?: string;
}
