const mongoose = require('mongoose');
const _ = require('lodash');
const PlaylistsSchema = require('./schemas/PlaylistsSchema');

const PlaylistsModel = mongoose.model('playlists', PlaylistsSchema);

class Playlists {
  constructor(id) {
    this.id = id;
    this.playlists = null;
    this.playlist = null;
    this.errors = [];
    this.body = null;
  }

  async getAllPlaylists() {
    await this.getPlaylists();
    const { playlists } = this.playlists;

    return playlists;
  }

  async getPlaylist(playlistName) {
    if (!playlistName) {
      this.errors.push('Ocorreu um erro ao tentar acessar a playlist');
    }
    if (typeof playlistName !== 'string') {
      this.errors.push('Ocorreu um erro ao tentar acessar a playlist');
    }
    if (this.errors.length > 0) return;

    await this.getPlaylists();
    const { playlists } = this.playlists;

    const playlist = _.get(playlists, `${playlistName}`, null);

    if (!playlist) {
      this.errors.push('A playlist não existe');
      return;
    }

    this.playlist = playlist;
  }

  async createPlaylist(body) {
    this.body = body;
    this.valid();
    if (this.errors.length > 0) return;

    await this.getPlaylists();
    const { playlists } = this.playlists;

    const newPlaylists = { ...playlists };
    if (this.checkPlaylistExistence(this.body.playlistName, { ...newPlaylists })) {
      this.errors.push('Playlist já existe');
    }
    if (this.errors.length > 0) return;

    newPlaylists[this.body.playlistName] = [];
    await this.saveChanges({ ...newPlaylists });
  }

  async deletePlaylist(body) {
    this.body = body;
    this.valid();
    if (this.errors.length > 0) return;

    await this.getPlaylists();
    const { playlists } = this.playlists;

    const newPlaylists = { ...playlists };
    if (!this.checkPlaylistExistence(this.body.playlistName, { ...newPlaylists })) {
      this.errors.push('Playlist não encontrada');
    }
    if (this.errors.length > 0) return;

    delete newPlaylists[this.body.playlistName];

    await this.saveChanges({ ...newPlaylists });
  }

  async editPlaylist(playlistName, newPlaylistName) {
    if (!playlistName || typeof playlistName !== 'string') {
      this.errors.push('Ocorreu um erro ao tentar acessar a playlist');
      return;
    }

    this.body = { playlistName: newPlaylistName };
    this.valid();
    if (this.errors.length > 0) return;

    await this.getPlaylists();
    const { playlists } = this.playlists;

    const newPlaylists = { ...playlists };
    if (!this.checkPlaylistExistence(playlistName, { ...newPlaylists })) {
      this.errors.push('Playlist não existe');
      return;
    }
    if (this.checkPlaylistExistence(this.body.playlistName, { ...newPlaylists })) {
      this.errors.push('Nome de playlist já existe');
      return;
    }

    if (playlistName !== this.body.playlistName) {
      Object.defineProperty(
        newPlaylists,
        this.body.playlistName,
        Object.getOwnPropertyDescriptor(newPlaylists, playlistName),
      );
      delete newPlaylists[playlistName];
    }

    await this.saveChanges({ ...newPlaylists });
  }

  async addTrackToPlaylist(track, playlistName) {
    let notSent = false;
    if (!track) {
      this.errors.push('Ocorreu um erro ao tentar acessar a música');
      notSent = true;
    }
    if (typeof track !== 'object') {
      this.errors.push('Ocorreu um erro ao tentar acessar a música');
      notSent = true;
    }
    if (!playlistName) {
      this.errors.push('Ocorreu um erro ao tentar acessar a playlist');
      notSent = true;
    }
    if (typeof playlistName !== 'string') {
      this.errors.push('Ocorreu um erro ao tentar acessar a playlist');
      notSent = true;
    }
    if (notSent) return;
    await this.getPlaylists();
    const { playlists } = this.playlists;
    if (!this.checkPlaylistExistence(playlistName, playlists)) {
      this.errors.push('Playlist não encontrada');
    }
    if (this.errors.length > 0) return;

    const newPlaylists = { ...playlists };
    if (this.checkTrackExistence(track.id, playlistName, { ...newPlaylists })) {
      this.errors.push('Música já adicionada a essa playlist');
      return;
    }
    newPlaylists[playlistName].push(track);

    await this.saveChanges({ ...newPlaylists });
  }

  async removeTrackFromPlaylist(trackId, playlistName) {
    let notSent = false;
    if (!trackId) {
      this.errors.push('Ocorreu um erro ao tentar deletar a música');
      notSent = true;
    }
    if (typeof trackId !== 'string') {
      this.errors.push('Ocorreu um erro ao tentar deletar a música');
      notSent = true;
    }
    if (!playlistName) {
      this.errors.push('Ocorreu um erro ao tentar deletar a música');
      notSent = true;
    }
    if (typeof playlistName !== 'string') {
      this.errors.push('Ocorreu um erro ao tentar deletar a música');
      notSent = true;
    }
    if (notSent) return;
    await this.getPlaylists();
    const { playlists } = this.playlists;
    if (!this.checkPlaylistExistence(playlistName, playlists)) {
      this.errors.push('Playlist não encontrada');
    }
    if (this.errors.length > 0) return;

    const newPlaylists = { ...playlists };
    const track = this.checkTrackExistence(trackId, playlistName, { ...newPlaylists });
    if (!track) {
      this.errors.push('Música não encontrada na playlist');
      return;
    }

    function removeObjectFromArray(array, key, value) {
      const resultArray = [...array];
      array.forEach((obj) => {
        if (obj[key] === value) {
          resultArray.splice(array.indexOf(obj), 1);
        }
      });
      return resultArray;
    }

    newPlaylists[playlistName] = removeObjectFromArray(newPlaylists[playlistName], 'id', trackId);

    await this.saveChanges({ ...newPlaylists });
  }

  checkTrackExistence(trackId, playlistName, searchObj) {
    let existTrack = false;
    const keys = Object.keys(searchObj);
    for (let i = 0; i < keys.length; i += 1) {
      if (keys[i] === playlistName) {
        // eslint-disable-next-line no-loop-func
        searchObj[keys[i]].forEach((itemTrackPlaylist) => {
          if (itemTrackPlaylist.id === trackId) {
            existTrack = itemTrackPlaylist;
          }
        });
      }
    }
    return existTrack;
  }

  checkPlaylistExistence(playlistName, searchObj) {
    const keys = Object.keys(searchObj);
    for (let i = 0; i < keys.length; i += 1) {
      if (keys[i] === playlistName) {
        return true;
      }
    }
    return false;
  }

  async getPlaylists() {
    this.playlists = await PlaylistsModel.findOne({ user_id: this.id });
  }

  async saveChanges(newObject) {
    await PlaylistsModel.findOneAndUpdate(
      { user_id: this.id },
      { playlists: { ...newObject } },
      { new: true },
    );
  }

  valid() {
    let notSent = false;
    if (!this.body.playlistName) {
      notSent = true;
      this.errors.push('Ocorreu um erro ao tentar acessar a playlist');
    }
    if (typeof this.body.playlistName !== 'string') {
      notSent = true;
      this.errors.push('Ocorreu um erro ao tentar acessar a playlist');
    }
    if (notSent) return;
    this.cleanUp();

    if (this.body.playlistName.length < 1 || this.body.playlistName.length > 120) this.errors.push('Nome da playlist deve conter entre 1 e 120 caracteres');
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
