import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject } from 'inversify';

import { ConfigInterface } from '../../common/config/config.interface.js';
import { Controller } from '../../common/controller/controller.js';
import { HttpError } from '../../common/errors/http.error.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { PrivateRouteMiddleware } from '../../middlewares/privateRoute.middleware.js';
import { ValidateDtoMiddleware } from '../../middlewares/validateDto.middleware.js';
import { Component } from '../../types/types/component.type.js';
import { HttpMethod } from '../../types/enums/httpMethod.enum.js';
import { fillDTO } from '../../utils/dto.js';
import { MovieServiceInterface } from '../movie/movieService.interface.js';
import { UserServiceInterface } from '../user/userService.interface.js';
import { CommentServiceInterface } from './commentService.interface.js';
import { CommentRoute } from './comment.route.js';
import { CreateCommentDto } from './dto/createComment.dto.js';
import { CommentResponse } from './response/comment.response.js';

export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.UserServiceInterface)
    private readonly userService: UserServiceInterface,
    @inject(Component.CommentServiceInterface)
    private readonly commentService: CommentServiceInterface,
    @inject(Component.MovieServiceInterface)
    private readonly movieService: MovieServiceInterface
  ) {
    super(logger, configService);

    this.logger.info('Зарегистрированы пути для CommentController.');
    this.addRoute<CommentRoute>({
      path: CommentRoute.Root,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(this.userService),
        new ValidateDtoMiddleware(CreateCommentDto),
      ],
    });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { body, user } = req;

    if (!(await this.movieService.exists(body.movieId))) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Фильма с id ${body.movieId} не существует.`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create(body, user.id);
    this.created(res, fillDTO(CommentResponse, comment));
  }
}
