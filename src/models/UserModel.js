const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const UserSchema = require('./schemas/UserSchema');

const UserModel = mongoose.model('users', UserSchema);

class User {
  constructor(id, body) {
    this.id = id;
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async show() {
    this.user = await UserModel.findOne({ _id: this.id });
  }

  async update() {
    this.valid();
    await this.userExists();
    if (this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.user = await UserModel.findOneAndUpdate(
      { _id: this.id },
      {
        username: this.body.username,
        email: this.body.email,
        password: this.body.password,
      },
      { new: true },
    );
  }

  async delete() {
    await this.userExists();
    if (this.errors.length > 0) return;

    await UserModel.findOneAndDelete({ _id: this.id });
  }

  async userExists() {
    this.user = await UserModel.findOne({ _id: this.id });
    if (!this.user) this.errors.push('Usuário não existe');
  }

  valid() {
    let notSent = false;
    if (!this.body.username) {
      notSent = true;
      this.errors.push('Nome de usuário deve ser enviado');
    }
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

    if (this.body.username.length < 3 || this.body.username.length > 24) this.errors.push('Nome deve conter entre 3 e 24 caracteres');
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
      username: this.body.username.trim(),
      email: this.body.email.trim(),
      password: this.body.password.trim(),
    };
  }
}

export default User;
