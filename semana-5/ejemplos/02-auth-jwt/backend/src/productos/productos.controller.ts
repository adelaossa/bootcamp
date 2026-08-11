import {
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
} from "@nestjs/common";

import { Roles } from "../auth/roles.decorator.js";
import { RolesGuard } from "../auth/roles.guard.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";

@Controller("productos")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductosController {
  // Almacen en memoria, sin BD
  private productos = [
    { id: 1, nombre: "Teclado", precio: 30 },
    { id: 2, nombre: "Mouse", precio: 20 },
  ];

  @Get()
  listar() {
    return this.productos;
  }

  @Delete(":id")
  @Roles("admin")
  borrar(@Param("id") id: string) {
    this.productos = this.productos.filter((p) => p.id !== Number(id));
    return { message: `producto ${id} borrado` };
  }
}