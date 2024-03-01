"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _lodash = require('lodash');

class CheckLoginController {
  async index(req, res) {
    if (!_lodash.get.call(void 0, req.session, 'user.email', null)) {
      return res.status(200).json({ login: false, user: null });
    }
    return res.status(200).json({ login: true, user: _lodash.get.call(void 0, req.session, 'user', '') });
  }
}

exports. default = new CheckLoginController();
