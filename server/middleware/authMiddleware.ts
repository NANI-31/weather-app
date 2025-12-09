import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.cookies.token) {
    try {
      token = req.cookies.token;
      // console.log("Cookies:", token); // Debugging

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

      req.user = {
        id: decoded.id,
      };

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export { protect };
