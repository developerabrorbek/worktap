import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { PrismaService } from 'prisma/prisma.service';
import { CategoryService } from './category.service';

@Module({
  controllers: [CategoryController],
  providers: [PrismaService, CategoryService],
})
export class CategoryModule {}
