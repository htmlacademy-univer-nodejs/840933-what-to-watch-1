export enum UserRoute {
  Register = '/register',
  Login = '/login',
  ToWatch = '/to_watch',
  Avatar = '/:userId/avatar',
  Static = '/static'
}

export const JWT_ALGORITHM = 'HS256';

export const DEFAULT_AVATAR_FILE_NAME = 'default-avatar.png';
