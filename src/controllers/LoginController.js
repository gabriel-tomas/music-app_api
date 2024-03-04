import jwt from 'jsonwebtoken';
import Login from '../models/LoginModel';

class LoginController {
  async login(req, res) {
    try {
      const login = new Login(req.body);
      await login.login();
      if (login.errors.length > 0) {
        return res.status(200).json({ errorsMsg: login.errors });
      }
      const { id, email } = login.user;
      const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION,
      });
      return res.json({ token, successMsg: 'Logado com sucesso', user: { username: login.user.username, email: login.user.email } });
    } catch (e) {
      console.log(e);
      return res.status(401).json({
        loggedIn: false,
        errors: [
          'Ocorreu um erro ao tentar se registrar',
        ],
      });
    }
  }
}

export default new LoginController();
