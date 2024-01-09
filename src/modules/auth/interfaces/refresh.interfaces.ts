export declare interface RefreshRequest {
  refreshToken: string;
  ip?: string;
  userAgent?: string;
}

export declare interface RefreshResponse{
  accessToken: string;
  refreshToken: string; 
}
