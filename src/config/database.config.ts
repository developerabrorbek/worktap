import { registerAs } from '@nestjs/config';

declare interface DatabaseConfigOptions {
  url: string;
}

export const databaseConfig = registerAs<DatabaseConfigOptions>(
  'database',
  (): DatabaseConfigOptions => ({
    url: process.env.DATABASE_URL,
  }),
);
