import { ApiProperty } from '@nestjs/swagger';
import { UpdateUserRequest } from '../interfaces';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto implements Omit<UpdateUserRequest, 'image'> {
  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;
}
