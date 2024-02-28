export default async (req, res, next) => {
  console.log(req.session);
  console.log('Passou pelo middleware global');
  next();
};
