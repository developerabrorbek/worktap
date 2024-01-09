import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateUserRequest } from './interfaces';

@Injectable()
export class UserService {
  #_prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.#_prisma.user.findMany({
      include: {
        orders: true,
        works: true,
      }
    });
  }

  async getSingleUser(userId: string): Promise<User> {
    await this.#_checkUser(userId);
    return await this.#_prisma.user.findFirst({
      where: { id: userId },
      include: {
        orders: true,
        userDevices: true,
        works: true,
      },
    });
  }

  async updateUser(payload: UpdateUserRequest, userId: string): Promise<void> {
    await this.#_checkUser(userId);

    if (payload.image?.path) {
      const imagePath = payload.image.path
        .replace('\\', '/')
        .replace('\\', '/');

      await this.#_prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          image: imagePath,
        },
      });
    }

    await this.#_prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: payload.name,
        password: payload.password,
        phone: payload.phone,
        surname: payload.surname,
      },
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.#_checkUser(id);
    await this.#_prisma.user.delete({ where: { id } });
  }

  async #_checkUser(userId: string): Promise<void> {
    const foundedUser = await this.#_prisma.user.findFirst({
      where: { id: userId },
    });

    if (!foundedUser) throw new NotFoundException('User not found');
  }
}
