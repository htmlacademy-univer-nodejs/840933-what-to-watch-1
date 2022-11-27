import { User } from './user.type.js';

export type Comment = {
  text: string;
  rating: number;
  publishingDate: number;
  author: User;
};
