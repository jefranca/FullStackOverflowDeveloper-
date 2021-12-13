import cors from "cors";
import express from "express";
import errorHandler from "./middlewares/errorHandler";
import { Request, Response, NextFunction } from "express";
import validateToken from "./middlewares/validateToken";
import connection from "./database";
import InvalidQuestion from "./errors/InvalidQuestion";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", async (req: Request, res: Response) => res.sendStatus(200));
app.post(
  "/questions",
  validateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    interface newQuestion {
      question: string;
      student: string;
      class: string;
      tags: string;
    }
    const { userId } = res.locals;
    const newQuestion: newQuestion = req.body;
    try {
      const result = await connection.query(
        "INSERT INTO questions (question,user_id,tags) VALUES ($1,$2,$3) RETURNING id",
        [newQuestion.question, userId, newQuestion.tags]
      );
      if (!result) throw new InvalidQuestion("Invalid Question");
      res.send(result.rows);
    } catch (error) {
      next(error);
    }
  }
);

app.use(errorHandler);

export default app;
