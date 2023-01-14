import fs from 'fs/promises';

export const MAX_MOVIES_COUNT = 60;

export enum MovieRoute {
  Root = '/',
  Create = '/create',
  Movie = '/:movieId',
  Promo = '/promo',
  Comments = '/:movieId/comments'
}

export const STATIC_IMAGES = await fs.readdir('./static');
