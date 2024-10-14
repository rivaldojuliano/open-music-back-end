const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, songService, validator) {
    this._service = service;
    this._validator = validator;
    this._songService = songService;

    autoBind(this);
  }

  async postAlbumHandler(request, h){
    this._validator.validateAlbumsPayload(request.payload);

    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;

    const album = await this._service.getAlbumById(id);
    album.songs = await this._songService.getSongByAlbumId(id);

    return {
      status: 'success',
      data: {
        album
      }
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumsPayload(request.payload);

    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album successfully updated'
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;

    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album deleted successfully'
    };
  }

  async postAlbumLikeByIdHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;

    await this._service.getAlbumById(id);
    await this._service.addAlbumLikeById(credentialId, id);

    const response = h.response({
      status: 'success',
      message: 'Album liked successfully'
    });
    response.code(201);
    return response;
  }

  async getAlbumLikeByIdHandler(request) {
    const { id } = request.params;

    const likes = await this._service.getAlbumLikeById(id);

    return {
      status: 'success',
      data: {
        likes
      }
    };
  }

  async deleteAlbumLikeByIdHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;

    await this._service.deleteAlbumLikeById(credentialId, id);

    return {
      status: 'success',
      message: 'Album deleted successfully'
    };
  }
}

module.exports = AlbumsHandler;
