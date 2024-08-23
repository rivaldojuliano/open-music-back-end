class AlbumsHandler {
  constructor(service, validator) {
    this._serivce = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h){
    this._validator.validateAlbumsPayload(request.payload);

    const { name, year } = request.payload;

    const albumId = await this._serivce.addAlbum({ name, year });

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

    const album = await this._serivce.getAlbumById(id);

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

    await this._serivce.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album successfully updated'
    };
  }
}

module.exports = AlbumsHandler;
