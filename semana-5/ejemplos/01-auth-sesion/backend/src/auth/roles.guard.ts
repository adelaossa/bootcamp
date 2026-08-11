import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";

import { ROLES_KEY } from "./roles.decorator.js";

// authZ: el usuario autenticado tiene el rol requerido?
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required =
      this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        ctx.getHandler(),
        ctx.getClass(),
      ]) ?? [];

    if (required.length === 0) return true;

    const req = ctx.switchToHttp().getRequest<Request>();
    const role = req.session?.user?.role;

    if (!role || !required.includes(role)) {
      throw new ForbiddenException(`requiere rol: ${required.join(", ")}`);
    }
    return true;
  }
}