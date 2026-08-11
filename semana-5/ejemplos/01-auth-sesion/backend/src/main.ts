import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import session from "express-session";

import { AppModule } from "./app.module.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware de sesiones: estado en el servidor + cookie HttpOnly
  app.use(
    session({
      name: "sessionId",
      secret: process.env.SESSION_SECRET ?? "secreto-dev",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true, // JS del navegador no puede leerla
        sameSite: "lax", // mitiga CSRF
        secure: false, // true en produccion (HTTPS)
        maxAge: 1000 * 60 * 60, // 1 hora
      },
    }),
  );

  // CORS con credenciales: obligatorio para que la cookie viaje entre origenes
  app.enableCors({
    origin: "http://localhost:5173",
    credentials: true,
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
  console.log(`Backend (sesion) en http://localhost:${port}`);
}

bootstrap();