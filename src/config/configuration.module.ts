import { Module } from '@nestjs/common';
import config from './config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [config],
    }),
  ],
})
export class configurationModule {}
export { ConfigModule };
