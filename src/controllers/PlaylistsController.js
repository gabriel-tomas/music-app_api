import { get } from 'lodash';
import Playlists from '../models/PlaylistsModel';

class PlaylistsController {
  async index(req, res) {
    const { userId } = req;
    const playlist = new Playlists(userId);
    const allPlaylists = await playlist.getAllPlaylists();
    return res.json({ playlists: { ...allPlaylists } });
  }

  async create(req, res) {
    const { userId } = req;
    const playlist = new Playlists(userId);
    await playlist.createPlaylist(req.body);
    if (playlist.errors.length > 0) {
      return res.status(400).json({ created: false, errorsMsg: playlist.errors });
    }
    return res.json({ created: true, successMsg: 'Playlist criada com sucesso' });
  }

  async delete(req, res) {
    const { userId } = req;
    const playlist = new Playlists(userId);
    await playlist.deletePlaylist(req.body);
    if (playlist.errors.length > 0) {
      return res.status(400).json({ deleted: false, errorsMsg: playlist.errors });
    }
    return res.json({ deleted: true, successMsg: 'Playlist removida com sucesso' });
  }

  async add(req, res) {
    const { userId } = req;
    const playlist = new Playlists(userId);
    await playlist.addTrackToPlaylist(req.body.track, req.body.playlistName);
    if (playlist.errors.length > 0) {
      return res.status(400).json({ added: false, errorsMsg: playlist.errors });
    }
    return res.json({ added: true, successMsg: 'Música adicionada com sucesso' });
  }

  async remove(req, res) {
    const { userId } = req;
    const playlist = new Playlists(userId);
    await playlist.removeTrackFromPlaylist(req.body.trackId, req.body.playlistName);
    if (playlist.errors.length > 0) {
      return res.status(400).json({ removed: false, errorsMsg: playlist.errors });
    }
    return res.json({ removed: true, successMsg: 'Música removida com sucesso' });
  }
}

export default new PlaylistsController();
