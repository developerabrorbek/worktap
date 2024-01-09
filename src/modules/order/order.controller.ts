import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { OrderService } from './order.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Order } from '@prisma/client';
import { CheckAuth } from '@decorators';
import { CreateOrderDto } from './dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Order")
@Controller('order')
export class OrderController {
  #_service: OrderService;

  constructor(service: OrderService) {
    this.#_service = service;
  }

  @Get('/all')
  async getAllOrders(): Promise<Order[]> {
    return await this.#_service.getAllOrders();
  }

  @CheckAuth(true)
  @Get()
  async getUserOrders(@Req() req: any): Promise<Order[]> {
    return await this.#_service.getUserOrders(req.userId);
  }

  @CheckAuth(true)
  @Post('add')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
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
  async createOrder(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: any,
    @Body() payload: CreateOrderDto,
  ): Promise<void> {
    await this.#_service.createOrder({ ...payload, files }, req.userId);
  }

  @Delete('/delete/:id')
  async deleteOrder(@Param('id') orderId: string): Promise<void> {
    await this.#_service.deleteOrder(orderId);
  }
}
