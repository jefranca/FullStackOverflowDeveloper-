import { NextFunction, Request, Response } from "express";
import connection from "../database";
import InvalidToken from "../errors/InvalidToken";

export default async function validateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split("Bearer ")[1];
  try {
    const userId = await connection.query(
      `SELECT "userId" FROM sessions WHERE token=$1`,
      [token]
    );
    if (!userId) throw new InvalidToken("Invalid Token");
    res.locals.userId = userId;
    next();
  } catch (error) {
    if (error instanceof InvalidToken) return res.status(401).send(error.message);
    next(error);
  }
}
