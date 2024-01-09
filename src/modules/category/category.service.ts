import { PrismaService } from '@prisma';
import { CategoryUpdateRequest, CreateCategoryRequest } from './interfaces';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { isUUID } from 'class-validator';

@Injectable()
export class CategoryService {
  #_prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async createCategory(payload: CreateCategoryRequest): Promise<void> {
    await this.#_prisma.category.create({
      data: {
        name: payload.name,
        parentId: payload.parentId,
      },
    });
  }

  async retrieveCategoryList(): Promise<Category[]> {
    const data = await this.#_prisma.category.findMany({
      where: {
        category: null,
        parentId: null,
      },
    });

    return data;
  }

  async updateCategory(payload: CategoryUpdateRequest): Promise<void> {
    this.#_checkUUID(payload.id);
    await this.#_prisma.category.update({
      where: { id: payload.id },
      data: { name: payload.name },
    });
  }

  async deleteCategory(id: string) {
    this.#_checkUUID(id);
    await this.#_prisma.category.delete({ where: { id } });
  }

  #_checkUUID(id: string) {
    if (!isUUID(id, 4))
      throw new BadRequestException(`Given ${id} id is not UUID`);
  }
}
