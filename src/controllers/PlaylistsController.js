import { get } from 'lodash';
import Playlists from '../models/PlaylistsModel';

class PlaylistsController {
  async index(req, res) {
    try {
      const { userId } = req;
      const playlist = new Playlists(userId);
      const allPlaylists = await playlist.getAllPlaylists();
      return res.json({ playlists: { ...allPlaylists } });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        errorsMsg: [
          'Ocorreu um erro ao tentar carregar as playlists',
        ],
      });
    }
  }

  async show(req, res) {
    try {
      const playlistName = get(req, 'params.name', '');
      const { userId } = req;
      const playlist = new Playlists(userId);
      await playlist.getPlaylist(playlistName);
      if (playlist.errors.length > 0) {
        return res.status(400).json({ errorsMsg: playlist.errors });
      }
      return res.json({ playlist: playlist.playlist });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        errorsMsg: [
          'Ocorreu um erro ao tentar carregar as playlists',
        ],
      });
    }
  }

  async create(req, res) {
    try {
      const { userId } = req;
      const playlist = new Playlists(userId);
      await playlist.createPlaylist(req.body);
      if (playlist.errors.length > 0) {
        return res.status(400).json({ created: false, errorsMsg: playlist.errors });
      }
      return res.json({ created: true, successMsg: 'Playlist criada com sucesso' });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        errorsMsg: [
          'Ocorreu um erro ao tentar criar a playlist',
        ],
      });
    }
  }

  async delete(req, res) {
    try {
      const { userId } = req;
      const playlist = new Playlists(userId);
      await playlist.deletePlaylist(req.body);
      if (playlist.errors.length > 0) {
        return res.status(400).json({ deleted: false, errorsMsg: playlist.errors });
      }
      return res.json({ deleted: true, successMsg: 'Playlist removida com sucesso' });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        errorsMsg: [
          'Ocorreu um erro ao tentar deletar a playlist',
        ],
      });
    }
  }

  async add(req, res) {
    try {
      const { userId } = req;
      const playlist = new Playlists(userId);
      await playlist.addTrackToPlaylist(req.body.track, req.body.playlistName);
      if (playlist.errors.length > 0) {
        return res.status(400).json({ added: false, errorsMsg: playlist.errors });
      }
      return res.json({ added: true, successMsg: 'Música adicionada com sucesso' });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        errorsMsg: [
          'Ocorreu um erro ao tentar adicionar a música à playlist',
        ],
      });
    }
  }

  async remove(req, res) {
    try {
      const { userId } = req;
      const playlist = new Playlists(userId);
      await playlist.removeTrackFromPlaylist(req.body.trackId, req.body.playlistName);
      if (playlist.errors.length > 0) {
        return res.status(400).json({ removed: false, errorsMsg: playlist.errors });
      }
      return res.json({ removed: true, successMsg: 'Música removida com sucesso' });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        errorsMsg: [
          'Ocorreu um erro ao tentar deletar a música da playlist',
        ],
      });
    }
  }
}

export default new PlaylistsController();
