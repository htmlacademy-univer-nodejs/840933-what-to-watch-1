import { ClassConstructor, plainToInstance } from 'class-transformer';

export const checkPassword = (password: string) => {
  if (password.length < 6 || password.length > 12) {
    throw new Error('Password should be from 6 to 12 characters');
  }
};

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });

export const getFullServerPath = (host: string, port: number) =>
  `http://${host}:${port}`;
