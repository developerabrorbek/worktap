import { IsBase64, IsOptional, IsUUID } from 'class-validator';
import { CategoryUpdateRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto implements Omit<CategoryUpdateRequest, 'id'> {
  @ApiProperty({
    nullable: true,
    example: 'base64 format image'
  })
  @IsBase64()
  @IsOptional()
  image?: string;

  @ApiProperty({
    nullable: true,
    example: '6500ee7e-e2cb-4ad0-b14d-d925f1de77f8'
  })
  @IsUUID(4)
  @IsOptional()
  name?: string;
}
