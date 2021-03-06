import cors from "cors";
import express from "express";
import errorHandler from "./middlewares/errorHandler";
import { Request, Response, NextFunction } from "express";
import validateToken from "./middlewares/validateToken";
import connection from "./database";
import InvalidQuestion from "./errors/InvalidQuestion";
import { v4 as uuid } from 'uuid';

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
  "/questions/:id",
  validateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { userId } = res.locals;
      const { answer } = req.body;
      await connection.query(
        "UPDATE questions SET answered=$1, answered_at=$2,answered_by=$3,answer=$4",
        [true, new Date(), userId, answer]
      );
      res.sendStatus(201);
    } catch (error) {
      next(error);
    }
  }
);
app.get(
  "/questions",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const questions = await connection.query(
        `SELECT questions.id, questions.question, users.student, users.class, question,submit_at 
        FROM  questions JOIN users ON questions.user_id = users.id WHERE answered=$1`,
        [false]
      );
      res.send(questions.rows);
    } catch (error) {
      next(error);
    }
  }
);
app.post("/users", async (req:Request, res:Response, next: NextFunction)=>{
  interface newUser {
    name: string;
    class: string;
  }
  try {
    const newUser:newUser = req.body;
    const userId=await connection.query(`INSERT INTO users (student,class) VALUES ($1,$2) RETURNING id`,[newUser.name, newUser.class])
    const id=userId.rows[0].id;
    console.log(userId.rows)
    const token = uuid();
    await connection.query(`INSERT INTO sessions (user_id,token) VALUES ($1,$2)`,[id,token])
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
})

app.use(errorHandler);

export default app;
