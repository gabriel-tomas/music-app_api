import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import UserSchema from '../models/schemas/UserSchema';

const UserModel = mongoose.model('users', UserSchema);

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      errorsMsg: ['Faça o login'],
    });
  }

  const [, token] = authorization.split(' ');

  try {
    const dados = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id, email } = dados;

    const user = await UserModel.findOne({ _id: id, email });

    if (!user) {
      return res.status(401).json({
        errorsMsg: ['Usuário não existe'],
      });
    }

    req.userId = id;
    req.userEmail = email;
    return next();
  } catch (e) {
    return res.status(401).json({
      errors: ['Faça o login novamente'],
    });
  }
};
