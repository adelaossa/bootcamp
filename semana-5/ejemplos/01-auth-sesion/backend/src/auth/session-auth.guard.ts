import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";

// authN: la sesion existe?
@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>();
    if (!req.session?.user) {
      throw new UnauthorizedException("no has iniciado sesion");
    }
    return true;
  }
}