import { Module } from "@nestjs/common";

import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { RolesGuard } from "./roles.guard.js";
import { SessionAuthGuard } from "./session-auth.guard.js";
import { UsersModule } from "../users/users.module.js";

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, SessionAuthGuard, RolesGuard],
})
export class AuthModule {}