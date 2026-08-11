import { Injectable, UnauthorizedException } from "@nestjs/common";

import { UsersService } from "../users/users.service.js";

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService) {}

  // authN: verificar credenciales
  validate(email: string, password: string) {
    const user = this.users.findByEmail(email);
    if (!user || user.password !== password) {
      throw new UnauthorizedException("credenciales invalidas");
    }
    // no devolvamos el password
    return { id: user.id, email: user.email, role: user.role };
  }
}