import { Body, Controller, Delete, Headers, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, LogoutDto, RefreshDto, RegisterDto } from './dtos';
import { LoginResponse, RegisterResponse } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  #_service: AuthService;

  constructor(service: AuthService) {
    this.#_service = service;
  }

  @Post('/register')
  async register(@Body() payload: RegisterDto): Promise<RegisterResponse> {
    return await this.#_service.register(payload);
  }

  @Post('/login')
  async login(@Body() payload: LoginDto): Promise<LoginResponse> {
    return await this.#_service.login(payload);
  }

  @Post('/refresh')
  async refresh(
    @Headers('refreshToken') refreshToken: string,
    @Body() payload: RefreshDto,
  ): Promise<LoginResponse> {
    return await this.#_service.refresh({ refreshToken, ...payload });
  }

  @Delete('/logout')
  async logout(@Body() payload: LogoutDto): Promise<void> {
    await this.#_service.logout(payload);
  }
}
