const mongoose = require('mongoose');

const PlaylistsSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  playlists: { type: Object, required: false, default: {} },
});

module.exports = PlaylistsSchema;
