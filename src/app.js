import cors from "cors";
import express from "express";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", async (req, res) => res.sendStatus(200));

app.use(errorHandler);

export default app;