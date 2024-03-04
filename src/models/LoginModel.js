import mongoose from 'mongoose';

const validator = require('validator');
const bcryptjs = require('bcryptjs');
const UserSchema = require('./schemas/UserSchema');

const UserModel = mongoose.model('users', UserSchema);
const InitPlaylistsModel = require('./InitPlaylistsModel');

class Register {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.valid();
    if (this.errors.length > 0) return;

    this.user = await UserModel.findOne({ email: this.body.email });
    if (!this.user) {
      this.errors.push('Usuário não existe');
      this.user = null;
      return;
    }
    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha incorreta');
      this.user = null;
      return;
    }

    const initPlaylists = new InitPlaylistsModel(this.user.id);
    await initPlaylists.create();
  }

  valid() {
    let notSent = false;
    if (!this.body.email) {
      notSent = true;
      this.errors.push('E-mail deve ser enviado');
    }
    if (!this.body.password) {
      notSent = true;
      this.errors.push('Senha deve ser enviada');
    }
    if (notSent) return;
    this.cleanUp();

    if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
    if (this.body.password.length < 8 || this.body.password.length > 24) this.errors.push('Senha deve conter entre 8 e 32 caracteres');
  }

  cleanUp() {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      email: this.body.email.trim(),
      password: this.body.password.trim(),
    };
  }
}

export default Register;
