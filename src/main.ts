import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, { cors: true });
    const port = 80;

    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('개발을 위한 API 문서입니다.')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    await app.listen(port);

    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }

    console.log(`Listening on port ${port}`);
  } catch (error) {
    console.error('Error during bootstrap:', error);
  }
}

bootstrap();
