import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateOrderRequest } from './interfaces';

@Injectable()
export class OrderService {
  #_prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.#_prisma.order.findMany();
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    await this.#_checkUser(userId);
    return await this.#_prisma.order.findMany({ where: { createdBy: userId } });
  }

  async createOrder(
    payload: CreateOrderRequest,
    userId: string,
  ): Promise<void> {
    await this.#_checkUser(userId);

    const filesPath = [];

    for (const el of payload.files) {
      if (el?.path) {
        filesPath.push(el.path.replace('\\', '/').replace('\\', '/'));
      }
    }

    await this.#_prisma.order.create({
      data: {
        description: payload.description,
        name: payload.name,
        price: payload.price,
        categoryId: payload.categoryId,
        createdBy: userId,
        files: {
          set: filesPath,
        },
      },
    });
  }

  async deleteOrder(id: string): Promise<void> {
    await this.#_prisma.order.delete({ where: { id } });
  }

  async #_checkUser(userId: string): Promise<void> {
    const foundedUser = await this.#_prisma.user.findFirst({
      where: { id: userId },
    });

    if (!foundedUser) throw new NotFoundException('User not found');
  }
}
