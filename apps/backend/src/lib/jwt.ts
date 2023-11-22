import { verify } from "jsonwebtoken";

export const verifyJwt = (authorization: string): { userId: string } | null => {
  try {
    const token = authorization.split("Bearer ").pop();
    if (!token) throw new Error();
    const user = verify(token, process.env.BACKEND_JWT_SECRET) as { sub: string };
    return { userId: user.sub };
  } catch (err) {
    return null;
  }
};
