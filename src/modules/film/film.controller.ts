import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { ControllerService } from '../../controller/controller.service.js';
import { HttpError } from '../../errors/http.errors.js';
import { Logger } from '../../common/logger/logger.type.js';
import { Component } from '../../types/component.type.js';
import { HttpMethod } from '../../utils/http.enum.js';
import { CreateFilmDto } from './dto/createFilm.dto.js';
import { UpdateFilmDto } from './dto/updateFilm.dto.js';
import { FilmServiceInterface } from './film.interface.js';
import { FilmRoute } from './film.route.js';
import { FilmResponse } from './response/film.response.js';
import { fillDTO } from '../../utils/dto.js';

@injectable()
export class FilmController extends ControllerService {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.FilmServiceInterface)
    private readonly filmService: FilmServiceInterface
  ) {
    super(logger);
    this.logger.info('Созданы маршруты для MovieController !');

    this.addRoute<FilmRoute>({
      path: FilmRoute.GET,
      method: HttpMethod.Get,
      handler: this.index,
    });

    this.addRoute<FilmRoute>({
      path: FilmRoute.POST,
      method: HttpMethod.Post,
      handler: this.create,
    });

    this.addRoute<FilmRoute>({
      path: FilmRoute.GET_FILMS,
      method: HttpMethod.Get,
      handler: this.getFilm,
    });

    this.addRoute<FilmRoute>({
      path: FilmRoute.UPDATE,
      method: HttpMethod.Patch,
      handler: this.updateFilm,
    });

    this.addRoute<FilmRoute>({
      path: FilmRoute.DELETE,
      method: HttpMethod.Delete,
      handler: this.deleteFilm,
    });

    this.addRoute<FilmRoute>({
      path: FilmRoute.GET_PROMO,
      method: HttpMethod.Get,
      handler: this.getPromo,
    });
  }

  async index(_req: Request, res: Response): Promise<void> {
    const films = await this.filmService.find();
    const filmsResponse = fillDTO(FilmResponse, films);
    this.ok(res, filmsResponse);
  }

  async create(
    {
      body,
    }: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDto>,
    res: Response
  ): Promise<void> {
    const result = await this.filmService.create(body);
    this.created(res, fillDTO(FilmResponse, result));
  }

  async getFilm(
    { params }: Request<Record<string, unknown>>,
    res: Response
  ): Promise<void> {
    const result = await this.filmService.findById(`${params.movieId}`);
    this.ok(res, fillDTO(FilmResponse, result));
  }

  async updateFilm(
    {
      params,
      body,
    }: Request<Record<string, string>, Record<string, unknown>, UpdateFilmDto>,
    res: Response
  ): Promise<void> {
    const film = await this.filmService.findById(params.movieId);

    if (!film) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Фильм с «${params.id}» не найден :(`,
        'MovieController'
      );
    }

    const result = await this.filmService.updateById(params.movieId, body);
    this.ok(res, fillDTO(FilmResponse, result));
  }

  async deleteFilm(
    { params }: Request<Record<string, string>>,
    res: Response
  ): Promise<void> {
    const film = await this.filmService.findById(`${params.id}`);

    if (!film) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Фильма с id «${params.id}» не существует.`,
        'MovieController'
      );
    }

    await this.filmService.deleteById(`${params.movieId}`);
    this.noContent(res, {
      message: 'Фильм был удален !'
    });
  }

  async getPromo(_: Request, res: Response): Promise<void> {
    const result = await this.filmService.findPromo();
    this.ok(res, fillDTO(FilmResponse, result));
  }
}
