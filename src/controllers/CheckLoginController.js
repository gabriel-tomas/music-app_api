import { get } from 'lodash';

class CheckLoginController {
  async index(req, res) {
    if (!get(req.session, 'user.email', null)) {
      return res.status(200).json({ login: false, user: null });
    }
    return res.status(200).json({ login: true, user: get(req.session, 'user', '') });
  }
}

export default new CheckLoginController();
