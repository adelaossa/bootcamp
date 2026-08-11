import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";

import { AuthService } from "./auth.service.js";
import { JwtAuthGuard } from "./jwt-auth.guard.js";
import { LoginDto } from "./dto/login.dto.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  login(@Body() dto: LoginDto) {
    // el servidor FIRMA y devuelve el token; No guarda ninguna sesion
    return this.auth.login(dto.email, dto.password);
  }

  @Get("perfil")
  @UseGuards(JwtAuthGuard)
  perfil(@Req() req: Request) {
    // el payload del token quedo en req.user por el guard
    const user = (req as any).user as { sub: number; role: string };
    return { id: user.sub, role: user.role, message: "acceso permitido (token valido)" };
  }
}