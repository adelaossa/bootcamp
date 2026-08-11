import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

import { AppModule } from "./app.module.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // No hay sesiones: el estado vive en el token (cliente).
  // No hace falta credentials: true en CORS porque el token va en Authorization header.
  app.enableCors({
    origin: "http://localhost:5173",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Backend (JWT) en http://localhost:${port}`);
}

bootstrap();