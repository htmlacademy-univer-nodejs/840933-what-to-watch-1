import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { ConfigInterface } from '../../common/config/config.interface.js';
import { ControllerService } from '../../controller/controller.service.js';
import { HttpError } from '../../errors/http.errors.js';
import { Logger } from '../../common/logger/logger.type.js';
import { Component } from '../../types/component.type.js';
import { HttpMethod } from '../../utils/http.enum.js';
import { fillDTO } from '../../utils/dto.js';
import { FilmResponse } from '../film/response/film.response.js';
import { CreateUserDto } from './dto/createUser.dto.js';
import { LoginUserDto } from './dto/loginUser.dto.js';
import UserResponse from './response/user.response.js';
import { UserServiceType } from './user.type.js';
import { UserRoute } from './user.route.js';
import { ValidateDtoMiddleware } from '../../middlewares/validateDTO.middleware.js';

@injectable()
export class UserController extends ControllerService {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.UserService)
    private readonly userService: UserServiceType,
    @inject(Component.ConfigInterface)
    private readonly configService: ConfigInterface
  ) {
    super(logger);
    this.logger.info('Созданы маршруты для UserController !');
    this.addRoute<UserRoute>({
      path: UserRoute.REGISTER,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute<UserRoute>({
      path: UserRoute.LOGIN,
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute<UserRoute>({
      path: UserRoute.LOGIN,
      method: HttpMethod.Get,
      handler: this.get,
    });
    this.addRoute<UserRoute>({
      path: UserRoute.LOGOUT,
      method: HttpMethod.Delete,
      handler: this.logout,
    });
    this.addRoute<UserRoute>({
      path: UserRoute.TO_WATCH,
      method: HttpMethod.Get,
      handler: this.getToWatch,
    });
    this.addRoute<UserRoute>({
      path: UserRoute.TO_WATCH,
      method: HttpMethod.Post,
      handler: this.postToWatch,
    });
    this.addRoute<UserRoute>({
      path: UserRoute.TO_WATCH,
      method: HttpMethod.Delete,
      handler: this.deleteToWatch,
    });
  }

  async create(
    {
      body,
    }: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(
      body,
      this.configService.get('SALT')
    );
    this.created(res, fillDTO(UserResponse, result));
  }

  async login({
    body,
  }: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    LoginUserDto
  >): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController'
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController'
    );
  }

  async get(
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      Record<string, string>
    >
  ): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController'
    );
  }

  async logout(
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      Record<string, string>
    >
  ): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController'
    );
  }

  async getToWatch(
    {
      body,
    }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      { userId: string }
    >,
    _res: Response
  ): Promise<void> {
    const result = this.userService.findListFilmToWatch(body.userId);
    this.ok(_res, fillDTO(FilmResponse, result));
  }

  async postToWatch(
    {
      body,
    }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      { userId: string; movieId: string }
    >,
    _res: Response
  ): Promise<void> {
    await this.userService.addFilmToWatch(body.userId, body.movieId);
    this.noContent(_res, {
      message: 'Успешно. Фильм добавлен в список "К просмотру".',
    });
  }

  async deleteToWatch(
    {
      body,
    }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      { userId: string; movieId: string }
    >,
    _res: Response
  ): Promise<void> {
    await this.userService.deleteFilmToWatch(body.userId, body.movieId);
    this.noContent(_res, {
      message: 'Фильм успешно удален из списка "К просмотру".',
    });
  }
}
