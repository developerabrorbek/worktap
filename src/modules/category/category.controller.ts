import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Headers,
  SetMetadata,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos';
import { ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Category } from '@prisma/client';

@ApiTags('Category')
@Controller({
  path: 'category',
  version: '1.0',
})
export class CategoryController {
  #_service: CategoryService;

  constructor(service: CategoryService) {
    this.#_service = service;
  }

  @ApiHeader({
    name: 'accept-language',
    required: true,
    example: 'uz'
  })
  @SetMetadata("roles", "all")
  @Get()
  async getCategoryList(
    @Headers('accept-language') languageCode: string,
  ): Promise<Category[]> {
    return await this.#_service.retrieveCategoryList(languageCode);
  }

  @ApiBody({
    type: CreateCategoryDto,
  })
  @SetMetadata("roles", ["admin", "super_admin"])
  @Post()
  async createCategory(@Body() payload: CreateCategoryDto): Promise<void> {
    await this.#_service.createCategory(payload);
  }

  @ApiBody({
    type: UpdateCategoryDto,
    required: true,
  })
  @SetMetadata("roles", ["admin", "super_admin"])
  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() payload: UpdateCategoryDto,
  ): Promise<void> {
    await this.#_service.updateCategory({ ...payload, id });
  }

  @SetMetadata("roles", ["admin", "super_admin"])
  @Delete(':id')
  async deleteCategory(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteCategory(id);
  }
}
