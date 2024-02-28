const mongoose = require('mongoose');
const PlaylistsSchema = require('./schemas/PlaylistsSchema');

const PlaylistsModel = mongoose.model('playlists', PlaylistsSchema);

class Playlists {
  constructor(id) {
    this.id = id;
    this.playlists = null;
    this.errors = [];
    this.body = null;
  }

  async createPlaylist(body) {
    this.body = body;
    this.valid();
    if (this.errors.length > 0) return;

    await this.getPlaylists();
    if (!this.playlists) {
      this.errors.push('Playlist não encontrada');
    }
    const { playlists } = this.playlists;

    const newPlaylist = { ...playlists };
    newPlaylist[this.body.playlistName] = [];

    await this.saveChanges({ ...newPlaylist });
  }

  async getPlaylists() {
    this.playlists = await PlaylistsModel.findOne({ user_id: this.id });
  }

  async saveChanges(newObject) {
    const savedPlaylists = await PlaylistsModel.findOneAndUpdate(
      { user_id: this.id },
      { playlists: { ...newObject } },
      { new: true },
    );
    console.log(savedPlaylists);
  }

  valid() {
    let notSent = false;
    if (!this.body.playlistName) {
      notSent = true;
      this.errors.push('Nome da playlist deve ser enviada');
    }
    if (notSent) return;
    this.cleanUp();

    if (this.body.playlistName.length < 3 || this.body.playlistName.length > 24) this.errors.push('Nome da playlist deve conter entre 1 e 120 caracteres');
  }

  cleanUp() {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      playlistName: this.body.playlistName.trim(),
    };
  }
}

module.exports = Playlists;
