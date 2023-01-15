import { TextEncoder } from 'node:util';
import { SignJWT } from 'jose';
import { createHmac } from 'crypto';

export const createJWT = async (
  algorithm: string,
  jwtSecret: string,
  payload: object
): Promise<string> =>
  new SignJWT({ ...payload })
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(new TextEncoder().encode(jwtSecret));

export const createSHA256 = (line: string, salt: string): string =>
  createHmac('sha256', salt).update(line).digest('hex');

export const checkPassword = (password: string) => {
  if (password.length < 6 || password.length > 12) {
    throw new Error('Password should be from 6 to 12 characters');
  }
};
