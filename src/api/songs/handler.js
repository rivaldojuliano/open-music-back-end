class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongsPayload(request.payload);

    const { title, year, genre, performer, duration, albumId } = request.payload;

    const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId });

    const response = h.response({
      status: 'success',
      data: {
        songId
      }
    });
    response.code(201);
    return response;
  }

  async getSongsHandler() {
    const songs = await this._service.getSongs();

    return {
      status: 'success',
      data: {
        songs
      }
    };
  }

  async getSongByIdHandler(request) {
    const  { id } = request.params;

    const song = await this._service.getSongById(id);

    return {
      status: 'success',
      data: {
        song
      }
    };
  }

  async putSongByIdHandler(request) {
    this._validator.validateSongsPayload(request.payload);

    const { id } = request.params;

    await this._service.editSongById(id, request.payload);

    return {
      status: 'success',
      message: 'Song successfully updated'
    };
  }
}

module.exports = SongsHandler;
