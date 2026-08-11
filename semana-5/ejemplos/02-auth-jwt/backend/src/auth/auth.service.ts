import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UsersService } from "../users/users.service.js";

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  // authN: validar credenciales y firmar un JWT (stateless)
  login(email: string, password: string) {
    const user = this.users.findByEmail(email);
    if (!user || user.password !== password) {
      throw new UnauthorizedException("credenciales invalidas");
    }

    const token = this.jwt.sign({ sub: user.id, role: user.role });
    return {
      token,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}