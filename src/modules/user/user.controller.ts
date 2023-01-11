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
import { ValidateObjectIdMiddleware } from '../../middlewares/validateObjectID.middleware.js';
import { UploadFileMiddleware } from '../../middlewares/upload.middleware.js';
import { PrivateRouteMiddleware } from '../../middlewares/privateRoute.middleware.js';
import { JWT_ALGORITHM, createJWT } from '../../utils/createJWT.js';
import LoggedUserResponse from './response/ loggedUser.response.js';

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
      path: UserRoute.TO_WATCH,
      method: HttpMethod.Get,
      handler: this.getToWatch,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute<UserRoute>({
      path: UserRoute.TO_WATCH,
      method: HttpMethod.Post,
      handler: this.postToWatch,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute<UserRoute>({
      path: UserRoute.TO_WATCH,
      method: HttpMethod.Delete,
      handler: this.deleteToWatch,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute<UserRoute>({
      path: UserRoute.AVATAR,
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
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
        `Пользователь с таким  email «${body.email}» существуют.`,
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
  >, res: Response): Promise<void> {
    const user = await this.userService.verifyUser(body, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const token = await createJWT(
      JWT_ALGORITHM,
      this.configService.get('JWT_SECRET'),
      { email: user.email, id: user.id}
    );

    this.ok(res, fillDTO(LoggedUserResponse, {email: user.email, token}));
  }

  async get(
    req: Request,
    res: Response
  ): Promise<void> {
    const { user }: any = req;
    const userByEmail = await this.userService.findByEmail(user.email);
    this.ok(res, fillDTO(LoggedUserResponse, userByEmail));
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
    const result = await this.userService.findListFilmToWatch(body.userId);
    this.ok(_res, fillDTO(FilmResponse, result));
  }

  async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }

  async postToWatch(
    {
      body,
    }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      { userId: string; filmId: string }
    >,
    _res: Response
  ): Promise<void> {
    await this.userService.addFilmToWatch(body.filmId, body.userId);
    this.noContent(_res, {
      message: 'Фильм успешно добавлен в список «К просмотру».',
    });
  }

  async deleteToWatch(
    {
      body,
    }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      { userId: string; filmId: string }
    >,
    _res: Response
  ): Promise<void> {
    await this.userService.deleteFilmToWatch(body.userId, body.filmId);
    this.noContent(_res, {
      message: 'Фильм успешно удален из списка "К просмотру".',
    });
  }
}
