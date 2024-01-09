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
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from '@prisma/client';
import { CheckAuth } from '@decorators';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos';

@ApiTags('User')
@Controller('user')
export class UserController {
  #_service: UserService;

  constructor(service: UserService) {
    this.#_service = service;
  }

  @Get('/all')
  async getAllUsers(): Promise<User[]> {
    return await this.#_service.getAllUsers();
  }

  @CheckAuth(true)
  @Get('/single')
  async getSingleUser(@Req() req: any): Promise<User> {
    return await this.#_service.getSingleUser(req.userId);
  }

  @CheckAuth(true)
  @Post('/edit/:id')
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
  async updateuser(
    @UploadedFile() image: Express.Multer.File,
    @Body() payload: UpdateUserDto,
    @Param('id') userId: string,
  ): Promise<void> {
    await this.#_service.updateUser({ ...payload, image }, userId);
  }

  @Delete('/delete/:id')
  async deleteUser(@Param('id') userId: string): Promise<void> {
    await this.#_service.deleteUser(userId);
  }
}
