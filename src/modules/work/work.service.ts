import { Injectable, NotFoundException } from '@nestjs/common';
import { Work } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateWorkRequest } from './interfaces';

@Injectable()
export class WorkService {
  #_prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async getAllWorks(): Promise<Work[]> {
    return await this.#_prisma.work.findMany();
  }

  async getUserWorks(userId: string): Promise<Work[]> {
    await this.#_checkUser(userId);
    return await this.#_prisma.work.findMany({ where: { createdBy: userId } });
  }

  async createWork(payload: CreateWorkRequest, userId: string): Promise<void> {
    await this.#_checkUser(userId);

    const imagePath = payload.image.replace('\\', '/').replace('\\', '/');

    await this.#_prisma.work.create({
      data: {
        description: payload.description,
        name: payload.name,
        price: payload.price,
        image: imagePath,
        createdBy: userId,
      },
    });
  }

  async deleteWork(id: string): Promise<void> {
    await this.#_prisma.work.delete({ where: { id } });
  }

  async #_checkUser(userId: string): Promise<void> {
    const foundedUser = await this.#_prisma.user.findFirst({
      where: { id: userId },
    });

    if (!foundedUser) throw new NotFoundException('User not found');
  }
}
