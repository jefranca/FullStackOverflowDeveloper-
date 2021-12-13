import dotenv from 'dotenv';

const { NODE_ENV } = process.env;

let path = '.env';
if (NODE_ENV === 'test') path = '.env.test';

dotenv.config({
  path,
});