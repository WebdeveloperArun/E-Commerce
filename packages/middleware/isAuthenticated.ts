import prisma from "@packages/libs/prisma";
import jwt from "jsonwebtoken";

const isAuthenticated = async (req: any, res: any, next: any) => {
  try {
    const token =
      req.cookie.access_token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized! token missing" });
    }

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
      role: "user" | "seller";
    };
    if (!decode) {
      return res.status(401).json({ message: "Unauthorized! Invalid token" });
    }

    const account = await prisma.users.findUnique({
      where: { id: decode.id },
    });
    if (!account) {
      return res.status(401).json({ message: "Account no found!" });
    }

    req.user = account;

    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized! Invalid token or expired" });
  }
};

export default isAuthenticated;
