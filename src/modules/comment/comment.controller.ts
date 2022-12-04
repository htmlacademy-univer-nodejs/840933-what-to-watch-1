import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import * as staticCore from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';

import { ControllerService } from '../../controller/controller.service.js';
import { Component } from '../../types/component.type.js';
import { Logger } from '../../common/logger/logger.type.js';
import { FilmServiceInterface } from '../film/film.interface.js';
import { CommentServiceInterface } from './comment.interface.js';
import { HttpMethod } from '../../utils/http.enum.js';
import { FilmRoute } from '../film/film.model.js';
import { fillDTO } from '../../utils/dto.js';
import { CreateFilmDto } from '../film/dto/createFilm.dto.js';
import { HttpError } from '../../errors/http.errors.js';
import { UpdateFilmDto } from '../film/dto/updateFilm.dto.js';
import { FilmResponse } from '../film/response/film.response.js';
import { ValidateObjectIdMiddleware } from '../../middlewares/validateObjectID.middleware.js';
import { ValidateDtoMiddleware } from '../../middlewares/validateDTO.middleware.js';
import { CommentResponse } from './response/comment.response.js';
import { ParamsGetFilm } from '../../types/params.type.js';

@injectable()
export default class MovieController extends ControllerService {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.FilmModel) private readonly filmService: FilmServiceInterface,
    @inject(Component.CommentModel) private readonly commentService: CommentServiceInterface,
  ) {
    super(logger);
    this.logger.info('Маршруты для MovieController.');

    this.addRoute<FilmRoute>({
      path: FilmRoute.POST,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateFilmDto),
      ],
    });
    this.addRoute<FilmRoute>({
      path: FilmRoute.GET,
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
      ],
    });
    this.addRoute<FilmRoute>({ path: FilmRoute.GET_MOVIES, method: HttpMethod.Get, handler: this.index });
    this.addRoute<FilmRoute>({
      path: FilmRoute.UPDATE,
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new ValidateDtoMiddleware(UpdateFilmDto),
      ],
    });
    this.addRoute<FilmRoute>({
      path: FilmRoute.DELETE,
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
      ],
    });
    this.addRoute<FilmRoute>({
      path: FilmRoute.GET_COMMENTS,
      method: HttpMethod.Get,
      handler: this.indexComments,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
      ],
    });
  }

  async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDto>, res: Response): Promise<void> {
    const result = await this.filmService.create(body);

    this.created(res, fillDTO(FilmResponse, result));
  }

  async show({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const film = await this.filmService.findById(`${params.id}`);

    if (!film) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Фильм с id '${params.id}' не найден`, 'FilmController');
    }

    this.ok(res, fillDTO(FilmResponse, film));
  }

  async index(_req: Request, res: Response): Promise<void> {
    const films = await this.filmService.find();

    this.ok(res, fillDTO(FilmResponse, films));
  }

  async update({params, body}: Request<Record<string, string>, Record<string, unknown>, UpdateFilmDto>, res: Response): Promise<void> {
    const film = await this.filmService.findById(params.id);

    if (!film) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Фильм с is '${params.id}' не найден`, 'MovieController');
    }

    const result = await this.filmService.updateById(params.id, body);

    this.ok(res, fillDTO(FilmResponse, result));
  }

  async delete({params}: Request<Record<string, string>>, res: Response): Promise<void> {
    const film = await this.filmService.findById(`${params.id}`);

    if (!film) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Фильм с is '${params.id}' не найден`, 'MovieController');
    }

    await this.filmService.deleteById(`${params.id}`);

    this.noContent(res, {message: 'Фильм был успешно удален'});
  }

  async indexComments({params}: Request<staticCore.ParamsDictionary | ParamsGetFilm>, res: Response): Promise<void> {
    const comments = await this.commentService.findByFilmId(params.id);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}
