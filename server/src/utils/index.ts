import JWT from "jsonwebtoken";
import "dotenv/config";
//Sign JWT access Token
export const signJWT = (id: string, email: string, role: "admin" | "user") => {
  const accessToken = JWT.sign(
    { id, email, role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" },
  );

  return accessToken;
};
