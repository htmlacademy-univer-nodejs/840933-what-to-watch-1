import { Genre } from './genre.type';
import { User } from './user.type';

export type Film = {
    name: string;
    description: string;
    publicationDate: Date;
    genre: Genre;
    releaseYear: number;
    rating: number;
    previewLink: string;
    videoLink: string;
    actors: string[];
    producer: string;
    duration: number;
    commentCount: number;
    user: User;
    poster: string;
    backgroundImage: string;
    backgroungColor: string;
}
