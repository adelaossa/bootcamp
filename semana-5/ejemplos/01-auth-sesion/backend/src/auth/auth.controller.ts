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
import { LoginDto } from "./dto/login.dto.js";
import { SessionAuthGuard } from "./session-auth.guard.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const user = this.auth.validate(dto.email, dto.password);
    //_state server-side: guardamos la identidad en la sesion
    req.session.user = { id: user.id, role: user.role };
    return { message: "login ok", user };
  }

  @Post("logout")
  async logout(@Req() req: Request) {
    // destruir la sesion en el servidor
    await new Promise<void>((resolve) => {
      req.session.destroy(() => resolve());
    });
    return { message: "logout ok" };
  }

  @Get("perfil")
  @UseGuards(SessionAuthGuard)
  perfil(@Req() req: Request) {
    const id = req.session.user!.id;
    const role = req.session.user!.role;
    return { id, role, message: "acceso permitido (sesion valida)" };
  }
}