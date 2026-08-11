import { Module } from "@nestjs/common";

import { AppController } from "./app.controller.js";
import { AuthModule } from "./auth/auth.module.js";
import { ProductosModule } from "./productos/productos.module.js";
import { UsersModule } from "./users/users.module.js";

@Module({
  imports: [UsersModule, AuthModule, ProductosModule],
  controllers: [AppController],
})
export class AppModule {}