import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshRequest,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
} from './interfaces';
import { ConfigService } from '@nestjs/config';
import { isJWT } from 'class-validator';

@Injectable()
export class AuthService {
  #_prisma: PrismaService;
  #_jwt: JwtService;
  #_config: ConfigService;

  constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService) {
    this.#_prisma = prisma;
    this.#_jwt = jwt;
    this.#_config = config;
  }

  async login(payload: LoginRequest): Promise<LoginResponse> {
    const foundedUser = await this.#_prisma.user.findFirst({
      where: { password: payload.password, email: payload.email },
    });

    if (!foundedUser) {
      throw new NotFoundException('User not found');
    }

    const foundedUserDevice = await this.#_prisma.userDevice.findFirst({
      where: {
        userId: foundedUser.id,
        userAgent: payload.userAgent,
        ip: payload.ip,
      },
    });

    const accessToken = this.#_createAccessToken(foundedUser.id);
    const refreshToken = this.#_createRefreshToken(foundedUser.id);

    if (foundedUserDevice) {
      await this.#_prisma.userDevice.update({
        where: { id: foundedUserDevice.id },
        data: {
          accessToken,
          refreshToken,
        },
      });

      return {
        accessToken,
        refreshToken,
      };
    }

    await this.#_prisma.userDevice.create({
      data: {
        accessToken,
        refreshToken,
        userId: foundedUser.id,
        userAgent: payload.userAgent,
        ip: payload.ip,
        deletedAt: null,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(payload: RefreshRequest): Promise<RefreshResponse> {
    try {
      if (!isJWT(payload.refreshToken)) {
        throw new UnprocessableEntityException('Invalid token');
      }

      const data = await this.#_jwt.verifyAsync(payload.refreshToken, {
        secret: this.#_config.getOrThrow<string>('jwt.refreshTokenSecretKey'),
      });

      const userDevice = await this.#_prisma.userDevice.findFirst({
        where: { ip: payload.ip, userAgent: payload.userAgent },
      });

      const accessToken = this.#_createAccessToken(data.id);
      const refreshToken = this.#_createRefreshToken(data.id);

      await this.#_prisma.userDevice.update({
        where: { id: userDevice.id },
        data: {
          accessToken,
          refreshToken,
        },
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new HttpException(err.message, 455);
      }
      throw new ForbiddenException('Refresh token error');
    }
  }

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    await this.#_checkExistingUser(payload.email);

    const newUser = await this.#_prisma.user.create({
      data: {
        email: payload.email,
        name: payload.name,
        password: payload.password,
        phone: payload.phone,
        surname: payload.surname,
        roles: payload.roles,
      },
    });

    const accessToken = this.#_createAccessToken(newUser.id);
    const refreshToken = this.#_createRefreshToken(newUser.id);

    await this.#_prisma.userDevice.create({
      data: {
        deletedAt: null,
        ip: payload.ip,
        userAgent: payload.userAgent,
        userId: newUser.id,
        accessToken,
        refreshToken,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(payload: LogoutRequest) {
    const foundedUserDevice = await this.#_prisma.userDevice.findFirst({
      where: {
        accessToken: payload.accessToken,
        ip: payload.ip,
        userAgent: payload.userAgent,
      },
    });

    if (!foundedUserDevice) {
      throw new NotFoundException('User device not found');
    }

    await this.#_prisma.userDevice.update({
      where: { id: foundedUserDevice.id },
      data: { deletedAt: new Date().toISOString() },
    });
  }

  #_createAccessToken(userId: string): string {
    const accessToken = this.#_jwt.sign(
      { id: userId },
      {
        secret: this.#_config.getOrThrow<string>('jwt.accessTokenSecretKey'),
        expiresIn: this.#_config.getOrThrow<string>(
          'jwt.accessTokenExpireTime',
        ),
      },
    );
    return accessToken;
  }

  #_createRefreshToken(userId: string): string {
    const refreshToken = this.#_jwt.sign(
      { id: userId },
      {
        secret: this.#_config.getOrThrow<string>('jwt.refreshTokenSecretKey'),
        expiresIn: this.#_config.getOrThrow<string>(
          'jwt.refreshTokenExpireTime',
        ),
      },
    );
    return refreshToken;
  }

  async #_checkExistingUser(email: string): Promise<void> {
    const foundedUser = await this.#_prisma.user.findFirst({
      where: { email },
    });

    if (foundedUser)
      throw new ConflictException(
        `User with this ${email} email is already exists`,
      );
  }
}
