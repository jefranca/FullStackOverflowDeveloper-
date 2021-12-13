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
      `SELECT "user_id" FROM sessions WHERE token=$1`,
      [token]
    );
    if (!userId.rowCount) throw new InvalidToken("Invalid Token");
    console.log(userId.rows[0].user_id)
    res.locals.userId = userId.rows[0].user_id;
    next();
  } catch (error) {
    if (error instanceof InvalidToken) return res.status(401).send(error.message);
    next(error);
  }
}
