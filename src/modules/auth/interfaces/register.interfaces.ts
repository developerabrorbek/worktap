import { UserRole } from '@prisma/client';

export declare interface RegisterRequest {
  userAgent?: string;
  ip?: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
  roles: UserRole[];
}

export declare interface RegisterResponse{
  accessToken: string;
  refreshToken: string; 
}
