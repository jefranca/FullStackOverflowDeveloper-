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
      if (error instanceof InvalidQuestion)
        return res.status(401).send(error.message);
      next(error);
    }
  }
);
app.post(
  "questions/:id",
  validateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { userId } = res.locals;
      const { answer } = req.body;
      await connection.query(
        "UPDATE questions SET answered=$1, answeredAt=$2,answeredBy=$3,answered=$4",
        [true,new Date(),userId,answer]
      );
      res.sendStatus(201)
    } catch (error) {
      next(error);
    }
  }
);

app.use(errorHandler);

export default app;
