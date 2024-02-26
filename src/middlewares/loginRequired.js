export default async (req, res, next) => {
  console.log('Passou pelo middleware global');
  next();
};
