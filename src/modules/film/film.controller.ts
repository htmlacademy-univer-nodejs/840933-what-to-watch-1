import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { DocumentType } from '@typegoose/typegoose';

import { ControllerService } from '../../controller/controller.service.js';
import { Logger } from '../../common/logger/logger.type.js';
import { Component } from '../../types/component.type.js';
import { HttpMethod } from '../../utils/http.enum.js';
import { CreateFilmDto } from './dto/createFilm.dto.js';
import { UpdateFilmDto } from './dto/updateFilm.dto.js';
import { FilmServiceInterface } from './film.interface.js';
import { FilmRoute } from './film.route.js';
import { FilmResponse } from './response/film.response.js';
import { fillDTO } from '../../utils/dto.js';
import { FilmEntity } from './film.entity.js';
import FilmListResponse from './response/filmList.response.js';
import { CommentServiceInterface } from '../comment/comment.interface.js';
import { ValidateObjectIdMiddleware } from '../../middlewares/validateObjectID.middleware.js';
import { DocumentExistsMiddleware } from '../../middlewares/documentExists.middleware.js';
import { CommentResponse } from '../comment/response/comment.response.js';
import { ValidateDtoMiddleware } from '../../middlewares/validateDTO.middleware.js';
import { PrivateRouteMiddleware } from '../../middlewares/privateRoute.middleware.js';
import { HttpError } from '../../errors/http.errors.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class FilmController extends ControllerService {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.FilmServiceInterface,)
    private readonly filmService: FilmServiceInterface,
    @inject(Component.CommentServiceInterface)
    private readonly commentService: CommentServiceInterface
  ) {
    super(logger);
    this.logger.info('Созданы маршруты для MovieController !');

    this.addRoute<FilmRoute>({path: FilmRoute.PROMO, method: HttpMethod.Get, handler: this.showPromo});
    this.addRoute<FilmRoute>({path: FilmRoute.ROOT, method: HttpMethod.Get, handler: this.index});
    this.addRoute<FilmRoute>({
      path: FilmRoute.CREATE,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateFilmDto)]
    });
    this.addRoute<FilmRoute>({
      path: FilmRoute.MOVIE,
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')
      ]
    });
    this.addRoute<FilmRoute>({
      path: FilmRoute.MOVIE,
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('filmId'),
        new ValidateDtoMiddleware(UpdateFilmDto),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')
      ]
    });
    this.addRoute<FilmRoute>({
      path: FilmRoute.MOVIE,
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')
      ]
    });
    this.addRoute<FilmRoute>({
      path: FilmRoute.COMMENTS,
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ]
    });
  }

  async index(req: Request, res: Response): Promise<void> {
    const { genre, limit } = req.query;
    const movies: DocumentType<FilmEntity>[] = genre ? await this.filmService.findByGenre(String(genre), Number(limit)) : await this.filmService.find(Number(limit));
    const movieResponse = fillDTO(FilmListResponse, movies);
    this.ok(res, movieResponse);
  }

  async create(req: Request, res: Response): Promise<void> {
    const { body, user }: any = req;
    const result = await this.filmService.create({...body, userId: user.id});
    const film = await this.filmService.findById(result.id);
    this.created(res, fillDTO(FilmResponse, film));
  }

  async show({params}: Request, res: Response): Promise<void> {
    const result = await this.filmService.findById(params.filmId);
    this.ok(res, fillDTO(FilmResponse, result));
  }

  async update(req: Request, res: Response): Promise<void> {
    const { params, body, user }: any = req;
    const film = await this.filmService.findById(params.filmId);
    if (film?.userId?.id !== user.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `Пользователь с ${user.id} не может обновить карточку фильма с id ${film?.id}.`,
        'MovieController'
      );
    }
    const result = await this.filmService.updateById(params.filmId, body);
    this.ok(res, fillDTO(FilmResponse, result));
  }

  async delete(req: Request, res: Response): Promise<void> {
    const {params, user}: any = req;
    const film = await this.filmService.findById(params.filmId);
    if (film?.userId?.id !== user.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `У пользователя с таким id ${user.id} нет прав на удаления фильма с id ${film?.id}.`,
        'MovieController'
      );
    }

    await this.filmService.deleteById(`${params.movieId}`);
    this.noContent(res, {message: 'Фильм успешно удален.'});
  }

  async showPromo(_: Request, res: Response): Promise<void> {
    const result = await this.filmService.findPromo();
    this.ok(res, fillDTO(FilmResponse, result));
  }

  async getComments({params}: Request, res: Response): Promise<void> {
    const comments = await this.commentService.findByFilmId(params.filmId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}
