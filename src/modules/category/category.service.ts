import { PrismaService } from '@prisma';
import { CategoryUpdateRequest, CreateCategoryRequest } from './interfaces';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MinioService } from 'client';
import { ConfigService } from '@nestjs/config';
import { Category } from '@prisma/client';
import { isUUID } from 'class-validator';
import { TranslateService } from 'modules/translate';

@Injectable()
export class CategoryService {
  #_prisma: PrismaService;
  #_minio: MinioService;
  #_config: ConfigService;
  #_translate: TranslateService;

  constructor(
    prisma: PrismaService,
    minio: MinioService,
    config: ConfigService,
    translate: TranslateService,
  ) {
    this.#_prisma = prisma;
    this.#_minio = minio;
    this.#_config = config;
    this.#_translate = translate;
  }

  async createCategory(payload: CreateCategoryRequest): Promise<void> {
    const file = await this.#_minio.uploadImage({
      bucket: this.#_config.getOrThrow<string>('minio.bucket'),
      file: payload.file,
    });
    if (!file.image) throw new NotFoundException('Image not found');

    await this.#_prisma.category.create({
      data: {
        image: file.image,
        name: payload.name,
        parentId: payload.parentId,
      },
    });
  }

  async retrieveCategoryList(languageCode: string): Promise<Category[]> {
    try {
      const data = await this.#_prisma.category.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          category: false,
          subcategory: {
            select: {
              id: true,
              image: true,
              name: true,
              subcategory: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
        where: {
          category: null,
          parentId: null,
        },
      });

      const filteredData = [];

      for (const c of data) {
        c.name = await this.#_getSingleTranslate(c.name, languageCode);
        for (const el of c.subcategory) {
          el.name = await this.#_getSingleTranslate(el.name, languageCode);
          for (const e of el.subcategory) {
            e.name = await this.#_getSingleTranslate(e.name, languageCode);
          }
        }
        filteredData.push(c);
      }

      return filteredData;
    } catch (error) {
      throw new ConflictException(error.message || 'Error on database');
    }
  }

  async updateCategory(payload: CategoryUpdateRequest): Promise<void> {
    this.#_checkUUID(payload.id);
    await this.#_prisma.category.update({
      where: { id: payload.id },
      data: { image: payload.image, name: payload.name },
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

  async #_getSingleTranslate(
    name: string,
    languageCode: string,
  ): Promise<string> {
    return (
      await this.#_translate.getSingleTranslate({
        translateId: name,
        languageCode,
      })
    ).value;
  }
}
