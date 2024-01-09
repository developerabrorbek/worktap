import { ApiProperty } from '@nestjs/swagger';
import { CreateWorkRequest } from '../interfaces';
import { IsString } from 'class-validator';

export class CreateWorkDto implements Omit<CreateWorkRequest, 'image'> {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  price: string;
}
