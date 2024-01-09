import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { PrismaService } from "prisma/prisma.service";
import { CategoryService } from "./category.service";
import { MinioService } from "client";
import { TranslateService } from "modules/translate";

@Module({
  controllers: [CategoryController],
  providers: [MinioService,PrismaService, TranslateService, CategoryService]
})
export class CategoryModule {}