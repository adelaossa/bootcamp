import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";

// authN: verificar firma y expiracion del JWT
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const auth = req.headers.authorization ?? "";
    const match = auth.match(/^Bearer (.+)$/);

    if (!match) {
      throw new UnauthorizedException("falta el token");
    }

    try {
      // verifyAsync valida la firma y expiracion; lanza si es invalido
      const payload = await this.jwt.verifyAsync(match[1]);
      // dejamos el payload disponible para handlers/guards siguientes
      (req as any).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException("token invalido o expirado");
    }
  }
}