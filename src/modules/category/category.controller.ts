import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos';
import { ApiTags } from '@nestjs/swagger';
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

  @Get()
  async getCategoryList(): Promise<Category[]> {
    return await this.#_service.retrieveCategoryList();
  }

  @Post()
  async createCategory(@Body() payload: CreateCategoryDto): Promise<void> {
    await this.#_service.createCategory(payload);
  }

  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() payload: UpdateCategoryDto,
  ): Promise<void> {
    await this.#_service.updateCategory({ ...payload, id });
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteCategory(id);
  }
}
