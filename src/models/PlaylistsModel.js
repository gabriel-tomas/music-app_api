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

  async addTrackToPlaylist(track, playlistName) {
    let notSent = false;
    if (!track) {
      this.errors.push('Musica deve ser enviada');
      notSent = true;
    }
    if (typeof track !== 'object') {
      this.errors.push('Musica deve ser um objeto');
      notSent = true;
    }
    if (!playlistName) {
      this.errors.push('Nome da playlist deve ser enviado');
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
      this.errors.push('Música já adicionada');
      return;
    }
    newPlaylists[playlistName].push(track);

    await this.saveChanges({ ...newPlaylists });
  }

  async removeTrackFromPlaylist(trackId, playlistName) {
    let notSent = false;
    if (!trackId) {
      this.errors.push('ID da musica deve ser enviada');
      notSent = true;
    }
    if (typeof trackId !== 'string') {
      this.errors.push('ID da musica deve ser uma string');
      notSent = true;
    }
    if (!playlistName) {
      this.errors.push('Nome da playlist deve ser enviado');
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
      this.errors.push('Música não encontrada');
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
