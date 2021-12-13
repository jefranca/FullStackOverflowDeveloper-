import './setup.js';
import app from './app.js';

const { PORT } = process.env;

app.listen(PORT, () => console.log(`Magic happens on port ${PORT}!`));