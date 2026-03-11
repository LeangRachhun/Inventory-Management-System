export interface JwtUser {
  id: string;
  email: string;
  role: "user" | "admin";
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

export {};
