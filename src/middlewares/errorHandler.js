export default async function errorHandler(error, req, res, next) {
  console.error(error);
  return res.sendStatus(500);
}
