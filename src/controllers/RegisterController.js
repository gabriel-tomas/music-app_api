import jwt from 'jsonwebtoken';
import Register from '../models/RegisterModel';

class RegisterController {
  async create(req, res) {
    try {
      const register = new Register(req.body);
      await register.create();
      if (register.errors.length > 0) {
        return res.status(400).json({ loggedIn: false, errorsMsg: register.errors });
      }
      const { id, email } = register.user;
      const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION,
      });
      return res.json({ token, successMsg: 'Usuário criado com sucesso', user: { name: register.user.username, email: register.user.email } });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        errorsMsg: [
          'Ocorreu um erro ao tentar se registrar',
        ],
      });
    }
  }
}

export default new RegisterController();
