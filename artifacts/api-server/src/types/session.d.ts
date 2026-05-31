import "express-session";

declare module "express-session" {
  interface SessionData {
    admin_authenticated?: boolean;
  }
}
