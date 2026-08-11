import { Module } from "@nestjs/common";

import { ProductosController } from "./productos.controller.js";

@Module({
  controllers: [ProductosController],
})
export class ProductosModule {}