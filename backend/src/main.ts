import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('TempMailBootstrap');
  const app = await NestFactory.create(AppModule);

  // Prefijo global de rutas /api
  app.setGlobalPrefix('api');

  // Habilitar CORS para permitir conexión desde el frontend de React
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Servidor TempMail corriendo en: http://localhost:${port}/api`);
  logger.log(`📬 Endpoint Webhook: POST http://localhost:${port}/api/webhooks/inbound-email`);
  logger.log(`📥 Endpoint REST: GET http://localhost:${port}/api/emails/:direccion`);
}
bootstrap();
