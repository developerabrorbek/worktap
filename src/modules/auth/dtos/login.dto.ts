import { IsEmail, IsOptional, IsString } from 'class-validator';
import { LoginRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto implements LoginRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
  ip?: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}
