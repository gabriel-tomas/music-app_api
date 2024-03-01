import Playlists from '../models/PlaylistsModel';

class PlaylistsController {
  async index(req, res) {
    return res.json('OI (PLAYLISTS)');
  }

  async create(req, res) {
    if (!req.session.id) {
      return res.status(401).json({ errors: 'ID is required' });
    }
    const playlist = new Playlists(req.session.user.id);
    await playlist.createPlaylist(req.body);
    if (playlist.errors.length > 0) {
      req.session.save();
      return res.status(200).json({ created: false, errors: playlist.errors });
    }
    return res.json({ created: true, success: 'Playlist criada com sucesso' });
  }

  async add(req, res) {
    if (!req.session.id) {
      return res.status(401).json({ errors: 'ID is required' });
    }
    const playlist = new Playlists(req.session.user.id);
    await playlist.addTrackToPlaylist(req.body.track, req.body.playlistName);
    if (playlist.errors.length > 0) {
      req.session.save();
      return res.status(200).json({ added: false, errors: playlist.errors });
    }
    return res.json({ added: true, success: 'Música adicionada com sucesso' });
  }

  async remove(req, res) {
    if (!req.session.id) {
      return res.status(401).json({ errors: 'ID is required' });
    }
    const playlist = new Playlists(req.session.user.id);
    await playlist.removeTrackFromPlaylist(req.body.trackId, req.body.playlistName);
    if (playlist.errors.length > 0) {
      req.session.save();
      return res.status(200).json({ removed: false, errors: playlist.errors });
    }
    return res.json({ removed: true, success: 'Música removida com sucesso' });
  }
}

export default new PlaylistsController();
