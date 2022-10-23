import * as crypto from 'crypto';

export const createSHA256 = (line: string, salt: string): string => {
  return crypto.createHmac('sha256', salt).update(line).digest('hex');
}