class AlbumsHandler {
  constructor(service, validator) {
    this._serivce = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
  }

  async postAlbumHandler(request, h){
    this._validator.validateAlbumsPayload(request.payload);

    const { name, year } = request.payload;

    const albumId = await this._serivce.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = AlbumsHandler;
