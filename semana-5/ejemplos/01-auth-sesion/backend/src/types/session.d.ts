import "express-session";

// Extiende el tipo de sesion para que TS conozca `req.session.user`
declare module "express-session" {
  interface SessionData {
    user?: { id: number; role: string };
  }
}