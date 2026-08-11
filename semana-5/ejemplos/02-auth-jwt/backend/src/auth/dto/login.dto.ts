import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "email invalido" })
  email: string;

  @IsString()
  @MinLength(4, { message: "password minimo 4 caracteres" })
  password: string;
}