import cors from "cors";
import express from "express";
import errorHandler from "./middlewares/errorHandler.js";
import { Request, Response, NextFunction } from "express";
import validateToken from "./middlewares/validateToken.js";

const app = express();
app.use(express.json());
app.use(cors());
  
app.get("/health", async (req: Request, res: Response) => res.sendStatus(200));
app.post("/questions", validateToken, async (req:Request, res:Response, next: NextFunction)=>{
       
})

app.use(errorHandler);

export default app;