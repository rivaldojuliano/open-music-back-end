const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(service, albumsService, validator) {
    this._service = service;
    this._albumsService = albumsService;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadImageHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    this._validator.validateImagesHeader(cover.hapi.headers);

    await this._albumsService.getAlbumById(id);

    const filename = await this._service.writeFile(cover, cover.hapi);

    // eslint-disable-next-line no-undef
    await this._albumsService.addCoverUrlAlbum(id, `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`);

    const response = h.response({
      status: 'success',
      message: 'Cover uploaded successfully',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;