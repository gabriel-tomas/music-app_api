"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _LoginModel = require('../models/LoginModel'); var _LoginModel2 = _interopRequireDefault(_LoginModel);

class LoginController {
  async login(req, res) {
    try {
      const login = new (0, _LoginModel2.default)(req.body);
      await login.login();
      if (login.errors.length > 0) {
        req.session.save();
        return res.status(200).json({ loggedIn: false, errors: login.errors });
      }
      req.session.user = {
        id: login.user.id,
        username: login.user.username,
        email: login.user.email,
        password: req.body.password.trim(),
      };
      req.session.save();
      return res.json({ loggedIn: true, success: 'Logado com sucesso' });
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

exports. default = new LoginController();
