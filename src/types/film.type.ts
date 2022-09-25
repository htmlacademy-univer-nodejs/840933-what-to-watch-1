import { GenreEnum } from './genre.enum';
import { User } from './user.type';

export type Film = {
    name: string;
    description: string;
    publicationDate: Date;
    genre: GenreEnum;
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
