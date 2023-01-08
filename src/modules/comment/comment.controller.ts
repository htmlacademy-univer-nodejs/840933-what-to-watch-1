import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject } from 'inversify';
import { HttpMethod } from '../../utils/http.enum';

import { Component } from '../../types/component.type';
import { Logger } from '../../common/logger/logger.type';
import { ControllerService } from '../../controller/controller.service';
import { CommentServiceInterface } from './comment.interface';
import { FilmServiceInterface } from '../film/film.interface';
import { CommentRoute } from './comment.route';
import { PrivateRouteMiddleware } from '../../middlewares/privateRoute.middleware';
import { ValidateDtoMiddleware } from '../../middlewares/validateDTO.middleware';
import { CommentDto } from './dto/comment.dto';
import { CommentResponse } from './response/comment.response';
import { fillDTO } from '../../utils/dto.js';
import { HttpError } from '../../errors/http.errors';

export default class CommentController extends ControllerService {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.CommentServiceInterface)
    private readonly commentService: CommentServiceInterface,
    @inject(Component.FilmServiceInterface)
    private readonly filmService: FilmServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController.');
    this.addRoute<CommentRoute>({
      path: CommentRoute.ROOT,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CommentDto),
      ],
    });
  }

  public async create(
    req: Request,
    res: Response
  ): Promise<void> {
    const { body, user } = req;

    if (!(await this.filmService.exists(body.filmId))) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Фильм с id ${body.filmId} не был найден.`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create({
      ...body,
      userId: user.id,
    });
    this.created(res, fillDTO(CommentResponse, comment));
  }
}
