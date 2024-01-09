import { ApiProperty } from '@nestjs/swagger';
import { CreateOrderRequest } from '../interfaces';
import { IsString, IsUUID } from 'class-validator';

export class CreateOrderDto implements Omit<CreateOrderRequest, 'files'> {
  @ApiProperty()
  @IsUUID(4)
  categoryId: string;

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
