import { SetMetadata } from '@nestjs/common';

export const CHECK_AUTH_KEY = 'check_auth';

export const CheckAuth = (isAuth: boolean) =>
  SetMetadata(CHECK_AUTH_KEY, isAuth);
