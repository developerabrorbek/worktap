import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { WorkService } from './work.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Work } from '@prisma/client';
import { CheckAuth } from '@decorators';
import { CreateWorkDto } from './dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Work')
@Controller('work')
export class WorkController {
  #_service: WorkService;

  constructor(service: WorkService) {
    this.#_service = service;
  }

  @Get('/all')
  async getAllWorks(): Promise<Work[]> {
    return await this.#_service.getAllWorks();
  }

  @CheckAuth(true)
  @Get()
  async getUserWorks(@Req() req: any): Promise<Work[]> {
    return await this.#_service.getUserWorks(req.userId);
  }

  @CheckAuth(true)
  @Post('add')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createWork(
    @UploadedFile() image: Express.Multer.File,
    @Req() req: any,
    @Body() payload: CreateWorkDto,
  ): Promise<void> {
    await this.#_service.createWork({ ...payload, image }, req.userId);
  }

  @Delete('/delete/:id')
  async deleteWork(@Param('id') orderId: string): Promise<void> {
    await this.#_service.deleteWork(orderId);
  }
}
