import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { DemoService } from './user.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('demo')
export class DemoController {
  #_service: DemoService;
  constructor(service: DemoService) {
    this.#_service = service;
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
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
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    console.log(file, 'controller');
  }

  @Post('uploads')
  @UseInterceptors(
    FilesInterceptor('files', 10,{
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
  async uploadMax(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files, 'controller');
  }
}
