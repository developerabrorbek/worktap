import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [OrderController],
  providers: [PrismaService,OrderService],
})
export class OrderModule {}
