const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, songsService, validator) {
    this._service = service;
    this._songsService = songsService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({ name, owner: credentialId });

    const response = h.response({
      status: 'success',
      data: {
        playlistId
      }
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists
      }
    };
  }

  async deletePlaylistByIdHandler(request){
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylists(id);

    return {
      status: 'success',
      message: 'Playlist deleted successfully'
    };
  }

  async postSongPlaylistByIdHandler(request, h) {
    this._validator.validateSongPlaylistPayload(request.payload);

    const { songId } = request.payload;
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(id, credentialId);
    await this._songsService.getSongById(songId);
    await this._service.addSongPlaylist(id, songId);

    await this._service.addActivity(id, songId, credentialId, 'add');

    const response = h.response({
      status: 'success',
      message: 'Song added to playlist'
    });
    response.code(201);
    return response;
  }

  async getSongPlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(id, credentialId);

    const playlist = await this._service.getSongPlaylistById(id);

    return {
      status: 'success',
      data: {
        playlist
      }
    };
  }

  async deleteSongPlaylistByIdHandler(request) {
    const { id } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(id, credentialId);

    await this._service.deleteSongFromPlaylist(id, songId);

    await this._service.addActivity(id, songId, credentialId, 'delete');

    return {
      status: 'success',
      message: 'Song deleted successfully'
    };
  }

  async getPlaylistActivitiesByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(id, credentialId);

    const activities = await this._service.getPlaylistActivityById(id);

    return {
      status: 'success',
      data: {
        playlistId: id,
        activities
      }
    };
  }
}

module.exports = PlaylistsHandler;
