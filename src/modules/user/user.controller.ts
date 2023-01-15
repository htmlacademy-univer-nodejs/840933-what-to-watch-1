import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { ConfigInterface } from '../../common/config/config.interface.js';
import { Controller } from '../../common/controller/controller.js';
import { HttpError } from '../../common/errors/http.error.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { PrivateRouteMiddleware } from '../../middlewares/privateRoute.middleware.js';
import { UploadFileMiddleware } from '../../middlewares/uploadFile.middleware.js';
import { ValidateDtoMiddleware } from '../../middlewares/validateDto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../middlewares/validateObjectId.middleware.js';
import { Component } from '../../types/types/component.type.js';
import { HttpMethod } from '../../types/enums/httpMethod.enum.js';
import { fillDTO } from '../../utils/dto.js';
import { MovieListItemResponse } from '../movie/response/movieListItem.response.js';
import { CreateUserDto } from './dto/createUser.dto.js';
import { LoginUserDto } from './dto/loginUser.dto.js';
import { LoggedUserResponse } from './response/loggedUser.response.js';
import { UserResponse } from './response/user.response.js';
import { UserServiceInterface } from './userService.interface.js';
import { UserRoute } from './user.route.js';
import { JWT_ALGORITHM } from '../../constants/crypto.constants.js';
import { UploadStaticMiddleware } from '../../middlewares/uploadStatic.middleware.js';
import { createJWT } from '../../utils/crypro.js';
import { BLOCKED_TOKENS } from '../../constants/blockedTokens.constant.js';
import { CheckTokenInBlackListMiddleware } from '../../middlewares/checkTokenInBlacklist.middleware.js';

@injectable()
export class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.UserServiceInterface)
    private readonly userService: UserServiceInterface
  ) {
    super(logger, configService);

    this.addRoute<UserRoute>({
      path: UserRoute.Register,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new UploadFileMiddleware(
          'avatar',
          this.configService.get('UPLOAD_DIRECTORY')
        ),
        new ValidateDtoMiddleware(CreateUserDto),
      ],
    });

    this.addRoute<UserRoute>({
      path: UserRoute.Login,
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)],
    });

    this.addRoute<UserRoute>({
      path: UserRoute.Login,
      method: HttpMethod.Get,
      handler: this.get,
    });

    this.addRoute<UserRoute>({
      path: UserRoute.Logout,
      method: HttpMethod.Post,
      handler: this.logout,
      middlewares: [
        new PrivateRouteMiddleware(this.userService)
      ]
    });

    this.addRoute<UserRoute>({
      path: UserRoute.MyList,
      method: HttpMethod.Get,
      handler: this.getMyList,
      middlewares: [
        new CheckTokenInBlackListMiddleware(),
        new PrivateRouteMiddleware(this.userService)
      ],
    });

    this.addRoute<UserRoute>({
      path: UserRoute.MyList,
      method: HttpMethod.Post,
      handler: this.addToMyList,
      middlewares: [
        new CheckTokenInBlackListMiddleware(),
        new PrivateRouteMiddleware(this.userService)
      ],
    });

    this.addRoute<UserRoute>({
      path: UserRoute.MyList,
      method: HttpMethod.Delete,
      handler: this.deleteFromMyList,
      middlewares: [
        new PrivateRouteMiddleware(this.userService),
        new CheckTokenInBlackListMiddleware()
      ],
    });

    this.addRoute<UserRoute>({
      path: UserRoute.Avatar,
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(this.userService),
        new CheckTokenInBlackListMiddleware(),
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(
          'avatar',
          this.configService.get('UPLOAD_DIRECTORY')
        ),
      ],
    });

    this.addRoute<UserRoute>({
      path: UserRoute.Static,
      method: HttpMethod.Post,
      handler: this.uploadStatic,
      middlewares: [
        new PrivateRouteMiddleware(this.userService),
        new CheckTokenInBlackListMiddleware(),
        new UploadStaticMiddleware(
          'static',
          this.configService.get('STATIC_DIRECTORY')
        ),
      ],
    });

    this.logger.info('Маршруты для UserController были зарегистрированы.');
  }

  async create(
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      CreateUserDto
    >,
    res: Response
  ): Promise<void> {
    const { body } = req;
    const existsUser = await this.userService.findByEmail(body.email);
    const salt = this.configService.get('SALT');

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Пользователь с таким «${body.email}» уже существует.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, salt);
    const createdUser: UserResponse = result;

    if (req.file) {
      const avatarPath = req.file.filename;
      await this.userService.setUserAvatarPath(result.id, avatarPath);
      createdUser.avatarPath = avatarPath;
    }

    this.created(res, fillDTO(UserResponse, createdUser));
  }

  async login(
    {
      body,
    }: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    res: Response
  ): Promise<void> {
    const salt = this.configService.get('SALT');
    const user = await this.userService.verifyUser(body, salt);

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
      { email: user?.email, id: user?.id }
    );

    this.ok(res, { token });
  }

  async get(req: Request, res: Response): Promise<void> {
    const token = String(req.headers.authorization?.split(' ')[1]);

    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const user = await this.userService.findByEmail(req.user.email);

    this.ok(res, {
      ...fillDTO(LoggedUserResponse, user),
      token,
    });
  }

  async logout(req: Request, res: Response): Promise<void> {
    const token = String(req.headers.authorization?.split(' ')[1]);

    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    BLOCKED_TOKENS.add(token);

    this.ok(res, {
      token
    });
  }

  async getMyList(
    req: Request<Record<string, unknown>, Record<string, unknown>>,
    _res: Response
  ): Promise<void> {
    const { user } = req;
    const result = await this.userService.getMyList(user.id);

    this.ok(_res, fillDTO(MovieListItemResponse, result));
  }

  async addToMyList(
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      { movieId: string }
    >,
    _res: Response
  ): Promise<void> {
    const { body, user } = req;
    await this.userService.addToMyList(body.movieId, user.id);

    this.noContent(_res, {
      message: 'Фильм успешно добавлен в «Мои фильмы».',
    });
  }

  async deleteFromMyList(
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      { movieId: string }
    >,
    _res: Response
  ): Promise<void> {
    const { body, user } = req;
    await this.userService.deleteFromMyList(body.movieId, user.id);
    this.noContent(_res, {
      message: 'Фильм успешно удален из «Мои фильмы».',
    });
  }

  async uploadAvatar(req: Request, res: Response) {
    const userId = req.params.userId;
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Пользователя с id -> ${userId} не существует :(`,
        'UploadFileMiddleware'
      );
    }

    if (req.file) {
      const createdFileName = req.file.filename;
      await this.userService.setUserAvatarPath(
        req.params.userId,
        createdFileName
      );
      this.created(res, {
        avatarPath: createdFileName,
      });
    }
  }

  async uploadStatic(req: Request, res: Response) {
    if (req.file) {
      const createdFileName = req.file.filename;
      this.created(res, {
        staticFile: createdFileName
      });
    }
  }
}
