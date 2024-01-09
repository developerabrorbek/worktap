import { IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateCategoryRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto implements CreateCategoryRequest {
  @ApiProperty({
    example: 'c3171463-7de0-4347-a172-2b228c46d27f',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'c3171463-7de0-4347-a172-2b228c46d27f',
    nullable: true,
  })
  @IsOptional()
  @IsUUID(4)
  parentId?: string;
}
