import User from '../models/UserModel';

class UserController {
  async show(req, res) {
    try {
      const { userId } = req;
      const user = new User(userId);
      await user.show();
      return res.json({ user: { username: user.user.username, email: user.user.email } });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        errorsMsg: [
          'Ocorreu um erro ao tentar requisitar seus dados',
        ],
      });
    }
  }

  async update(req, res) {
    try {
      const { userId } = req;
      const user = new User(userId, req.body);
      await user.update();
      if (user.errors.length > 0) {
        return res.status(400).json({ errorsMsg: user.errors });
      }
      return res.json({ user: { username: user.user.username, email: user.user.email }, successMsg: 'Dados atualizados com sucesso' });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        errorsMsg: [
          'Ocorreu um erro ao tentar se editar seu usuário',
        ],
      });
    }
  }

  async delete(req, res) {
    try {
      const { userId } = req;
      const user = new User(userId);
      await user.delete();
      if (user.errors.length > 0) {
        return res.status(401).json({ errorsMsg: user.errors });
      }
      return res.json({ successMsg: 'user deleted' });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        errorsMsg: [
          'Ocorreu um erro ao tentar se editar seu usuário',
        ],
      });
    }
  }
}

export default new UserController();
