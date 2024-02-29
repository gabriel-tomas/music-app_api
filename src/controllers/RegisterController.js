import Register from '../models/RegisterModel';

class RegisterController {
  async create(req, res) {
    try {
      const register = new Register(req.body);
      await register.create();
      if (register.errors.length > 0) {
        req.session.save();
        return res.status(200).json({ loggedIn: false, errors: register.errors });
      }
      req.session.user = {
        id: register.user.id,
        username: register.user.username,
        email: register.user.email,
        password: req.body.password.trim(),
      };
      req.session.save();
      return res.json({ loggedIn: true, success: 'Usuário criado com sucesso' });
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

export default new RegisterController();
