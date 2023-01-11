import { SignJWT } from 'jose';
import { TextEncoder } from 'node:util';

export const JWT_ALGORITHM = 'HS256';

export const createJWT = async (algorithm: string, jwtSecret: string, payload: object): Promise<string> =>
  new SignJWT({...payload})
    .setProtectedHeader({alg: algorithm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(new TextEncoder().encode(jwtSecret));
