import { StringOfLength } from './string-of-length.type';
import { GenreEnum } from './genre.enum';
import { NonNegative } from './non-negative-number.type';
import { User } from './user.type';

export type Film = {
    name: StringOfLength<2, 100>;
    description: StringOfLength<20, 1024>;
    publicationDate: string;
    genre: GenreEnum;
    releaseYear: NonNegative<number>;
    rating: NonNegative<number>;
    previewLink: string;
    videoLink: string;
    actors: string[];
    producer: StringOfLength<2, 50>;
    duration: NonNegative<number>;
    commentCount: NonNegative<number>;
    user: User;
    poster: string;
    backgroundImage: string;
    backgroungColor: string;
}
