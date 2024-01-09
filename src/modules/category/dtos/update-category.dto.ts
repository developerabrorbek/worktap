import { IsUUID } from 'class-validator';
import { CategoryUpdateRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto implements Omit<CategoryUpdateRequest, 'id'> {
  @ApiProperty({
    nullable: false,
    example: '6500ee7e-e2cb-4ad0-b14d-d925f1de77f8',
  })
  @IsUUID(4)
  name?: string;
}
