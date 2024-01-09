export declare interface LoginRequest {
  password: string;
  userAgent?: string;
  ip?: string;
  email: string;
}

export declare interface LoginResponse{
  accessToken: string;
  refreshToken: string; 
}
