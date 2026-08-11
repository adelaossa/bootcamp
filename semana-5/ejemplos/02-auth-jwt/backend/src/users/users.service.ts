import { Injectable } from "@nestjs/common";

export interface Usuario {
  id: number;
  email: string;
  password: string;
  role: string;
}

@Injectable()
export class UsersService {
  // Almacen en memoria: NO hay base de datos. Se reinicia al reiniciar el server.
  private readonly usuarios: Usuario[] = [
    { id: 1, email: "ana@x.com", password: "1234", role: "admin" },
    { id: 2, email: "bob@x.com", password: "1234", role: "user" },
  ];

  findByEmail(email: string): Usuario | undefined {
    return this.usuarios.find((u) => u.email === email);
  }
}