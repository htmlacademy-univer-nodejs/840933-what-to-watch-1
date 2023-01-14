import { TextEncoder } from 'node:util';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';
import crypto from 'crypto';
import * as jose from 'jose';

import {
  STATIC_IMAGES,
} from '../modules/movie/movie.models.js';
import { getGenre } from '../types/types/genre.type.js';
import { ServiceError } from '../types/enums/service-error.enum.js';
import { ValidationErrorField } from '../types/types/validation-error-field.type.js';

export const createMovie = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [
    title,
    description,
    publishingDate,
    genre,
    releaseYear,
    rating,
    previewPath,
    moviePath,
    actors,
    director,
    duration,
    userName,
    email,
    posterPath,
    backgroundImagePath,
    backgroundColor,
  ] = tokens;
  return {
    title,
    description,
    publishingDate: new Date(publishingDate),
    genre: getGenre(genre),
    releaseYear: Number(releaseYear),
    rating: Number(rating),
    previewPath,
    moviePath,
    actors: actors.split(';'),
    director,
    duration: Number(duration),
    commentsCount: 0,
    user: { email, name: userName },
    posterPath,
    backgroundImagePath,
    backgroundColor,
  };
};

export const checkPassword = (password: string) => {
  if (password.length < 6 || password.length > 12) {
    throw new Error('Password should be from 6 to 12 characters');
  }
};

export const createSHA256 = (line: string, salt: string): string =>
  crypto.createHmac('sha256', salt).update(line).digest('hex');

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });

export const createJWT = async (
  algorithm: string,
  jwtSecret: string,
  payload: object
): Promise<string> =>
  new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(new TextEncoder().encode(jwtSecret));

export const transformErrors = (
  errors: ValidationError[]
): ValidationErrorField[] =>
  errors.map(({ property, value, constraints }) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : [],
  }));

export const createErrorObject = (
  serviceError: ServiceError,
  message: string,
  details: ValidationErrorField[] = []
) => ({
  errorType: serviceError,
  message,
  details: [...details],
});

export const getFullServerPath = (host: string, port: number) =>
  `http://${host}:${port}`;

const isObject = (value: unknown) =>
  typeof value === 'object' && value !== null;

export const transformProperty = (
  property: string,
  someObject: Record<string, unknown>,
  transformFn: (object: Record<string, unknown>) => void
) => {
  Object.keys(someObject).forEach((key) => {
    if (key === property) {
      transformFn(someObject);
    } else if (isObject(someObject[key])) {
      const obj = Object(someObject[key]);
      transformProperty(property, obj, transformFn);
    }
  });
};

export const transformObject = (
  properties: string[],
  staticPath: string,
  uploadPath: string,
  data: Record<string, unknown>
) => {
  properties.forEach((property) =>
    transformProperty(property, data, (target: Record<string, unknown>) => {
      const file = target[property] as string;

      const rootPath = [
        ...STATIC_IMAGES,
      ].includes(`${target[property]}`)
        ? staticPath
        : uploadPath;

      target[property] = `${rootPath}/${file}`;
      console.log(`${rootPath}/${file}`);
    })
  );
};
