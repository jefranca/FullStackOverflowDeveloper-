import "./setup";
import app from "./app";

const { PORT } = process.env;

app.listen(PORT, () => console.log(`Magic happens on port ${PORT}!`));
