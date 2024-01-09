import { $Enums } from '@prisma/client';
import { RegisterRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Matches } from 'class-validator';

export class RegisterDto implements RegisterRequest {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @Matches(/^(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/)
  @IsString()
  phone: string;

  @ApiProperty()
  @IsEnum($Enums.UserRole, {
    each: true,
  })
  roles: $Enums.UserRole[];

  @ApiProperty()
  @IsString()
  surname: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  ip?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  userAgent?: string;
}
