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
    playlist.createPlaylist(req.body);
    if (playlist.errors.length > 0) {
      req.session.save();
      return res.status(200).json({ errors: playlist.errors });
    }
    return res.json({ success: 'Playlist criada com sucesso' });
  }
}

export default new PlaylistsController();
