import fs from 'fs/promises';

export const STATIC_IMAGES = await fs.readdir('./static');
