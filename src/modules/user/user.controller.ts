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
import { COMPONENT } from '../../types/types/component.type.js';
import { HttpMethod } from '../../types/enums/http-method.enum.js';
import { createJWT, fillDTO } from '../../utils/commonFunctions.js';
import { MovieListItemResponse } from '../movie/response/movieListItem.response.js';
import { CreateUserDto } from './dto/createUser.dto.js';
import { LoginUserDto } from './dto/loginUser.dto.js';
import { LoggedUserResponse } from './response/loggedUser.response.js';
import { UserResponse } from './response/user.response.js';
import { UserServiceInterface } from './userService.interface.js';
import { JWT_ALGORITHM, UserRoute } from './user.models.js';
import { UploadStaticMiddleware } from '../../middlewares/uploadStatic.middleware.js';

@injectable()
export class UserController extends Controller {
  constructor(
    @inject(COMPONENT.LoggerInterface) logger: LoggerInterface,
    @inject(COMPONENT.ConfigInterface) configService: ConfigInterface,
    @inject(COMPONENT.UserServiceInterface)
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
      path: UserRoute.ToWatch,
      method: HttpMethod.Get,
      handler: this.getToWatch,
      middlewares: [new PrivateRouteMiddleware(this.userService)],
    });
    this.addRoute<UserRoute>({
      path: UserRoute.ToWatch,
      method: HttpMethod.Post,
      handler: this.postToWatch,
      middlewares: [new PrivateRouteMiddleware(this.userService)],
    });
    this.addRoute<UserRoute>({
      path: UserRoute.ToWatch,
      method: HttpMethod.Delete,
      handler: this.deleteToWatch,
      middlewares: [new PrivateRouteMiddleware(this.userService)],
    });
    this.addRoute<UserRoute>({
      path: UserRoute.Avatar,
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(this.userService),
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
    const user = await this.userService.verifyUser(
      body,
      this.configService.get('SALT')
    );

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
      { email: user.email, id: user.id }
    );

    this.ok(res, { token });
  }

  async get(req: Request, res: Response): Promise<void> {
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
      token: req.headers.authorization?.split(' ')[1],
    });
  }

  async getToWatch(
    req: Request<Record<string, unknown>, Record<string, unknown>>,
    _res: Response
  ): Promise<void> {
    const { user } = req;
    const result = await this.userService.findToWatch(user.id);
    this.ok(_res, fillDTO(MovieListItemResponse, result));
  }

  async postToWatch(
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      { movieId: string }
    >,
    _res: Response
  ): Promise<void> {
    const { body, user } = req;
    await this.userService.addToWatch(body.movieId, user.id);

    this.noContent(_res, {
      message: 'Успешно. Фильм добавлен в список "К просмотру".',
    });
  }

  async deleteToWatch(
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      { movieId: string }
    >,
    _res: Response
  ): Promise<void> {
    const { body, user } = req;
    await this.userService.deleteToWatch(body.movieId, user.id);
    this.noContent(_res, {
      message: 'Успешно. Фильм удален из списка "К просмотру".',
    });
  }

  async uploadAvatar(req: Request, res: Response) {
    const userId = req.params.userId;
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${userId} doesn't exist`,
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
