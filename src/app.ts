import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule, CategoryModule,UserModule, OrderModule, WorkModule } from './modules';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { JWTConfig, databaseConfig } from '@config';
import { AuthGuard } from '@guard';
import { HttpExceptionFilter } from '@filters';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, JWTConfig],
    }),
    JwtModule,
    AuthModule,
    UserModule,
    CategoryModule,
    OrderModule,
    WorkModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
