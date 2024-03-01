"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _RegisterModel = require('../models/RegisterModel'); var _RegisterModel2 = _interopRequireDefault(_RegisterModel);

class RegisterController {
  async create(req, res) {
    try {
      const register = new (0, _RegisterModel2.default)(req.body);
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

exports. default = new RegisterController();
