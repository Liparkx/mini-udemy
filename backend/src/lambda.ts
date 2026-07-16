import { configure } from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let cachedServer: any;

export const handler = async (event: any, context: any, callback: any) => {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    app.enableCors(); // Essencial para a plataforma web
    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
    cachedServer = configure({ app: expressApp });
  }

  return cachedServer(event, context, callback);
};
