const mongoose = require('mongoose');
const PlaylistsSchema = require('./schemas/PlaylistsSchema');

const PlaylistsModel = mongoose.model('playlists', PlaylistsSchema);

class InitPlaylists {
  constructor(id) {
    this.createPlaylists = true;
    this.id = id;
  }

  async create() {
    await this.playlistsExist();
    if (!this.createPlaylists) return;

    await PlaylistsModel.create({ user_id: this.id });
  }

  async playlistsExist() {
    const playlists = await PlaylistsModel.findOne({ user_id: this.id });
    if (playlists) {
      this.createPlaylists = false;
    }
  }
}

module.exports = InitPlaylists;
