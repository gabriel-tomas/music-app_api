import Login from '../models/LoginModel';

class LoginController {
  async login(req, res) {
    try {
      const login = new Login(req.body);
      await login.login();
      if (login.errors.length > 0) {
        req.session.save();
        return res.status(200).json({ errors: login.errors });
      }
      req.session.user = {
        username: login.user.username,
        email: login.user.email,
        password: req.body.password.trim(),
      };
      req.session.save();
      return res.json({ success: 'Logado com sucesso' });
    } catch (e) {
      console.log(e);
      return res.status(401).json({
        errors: [
          'Ocorreu um erro ao tentar se registrar',
        ],
      });
    }
  }
}

export default new LoginController();
