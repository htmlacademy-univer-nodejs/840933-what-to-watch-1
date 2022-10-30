import * as crypto from 'crypto';

export const createSHA256 = (line: string, salt: string): string => crypto.createHmac('sha256', salt).update(line).digest('hex');
