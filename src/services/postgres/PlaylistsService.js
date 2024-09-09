const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlists-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to add playlists');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: 'SELECT playlists.id, playlists.name , users.username FROM playlists LEFT JOIN users ON users.id = playlists.owner WHERE playlists.owner = $1',
      values: [owner]
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylists(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to delete song. ID not found');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist not found');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('You cannot access this resource');
    }
  }

  async addSongPlaylist(playlistId, songId) {
    const id = `playlist-items-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to add song to playlist');
    }

    return result.rows[0].id;
  }

  async getSongPlaylist(playlistId) {
    const queryGetPlaylist = {
      text: 'SELECT playlists.id, playlists.name , users.username FROM playlists INNER JOIN users ON playlists.owner = users.id WHERE playlists.id = $1',
      values: [playlistId]
    };

    const playlistResult = await this._pool.query(queryGetPlaylist);

    if (!playlistResult.rows.length) {
      throw new NotFoundError('Playlist not found');
    }

    const queryGetSong = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM songs LEFT JOIN playlist_songs ON playlist_songs.song_id = songs.id WHERE playlist_songs.playlist_id = $1',
      values: [playlistId]
    };

    const songResult = await this._pool.query(queryGetSong);

    const playlist = playlistResult.rows[0];

    return {
      id: playlist.id,
      name: playlist.name,
      username: playlist.username,
      songs: songResult.rows
    };
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed deleted song from playlist');
    }
  }

  async addActivity(playlistId, songId, userId, action) {
    const id = `activity-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to add activity');
    }
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist not found');
    }

    return result.rows[0];
  }

  async getPlaylistActivityById(playlistId) {
    await this.getPlaylistById(playlistId);

    const query = {
      text: 'SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time FROM playlist_song_activities INNER JOIN songs ON playlist_song_activities.user_id = users.id WHERE playlist_id = $1 ORDER BY playlist_song_activities.time ASC',
      values: [playlistId]
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistsService;
