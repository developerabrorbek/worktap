import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CategoryModule, DemoModule } from './modules';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { JWTConfig, databaseConfig } from '@config';

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
    DemoModule,
    CategoryModule,
  ],
})
export class AppModule {}
