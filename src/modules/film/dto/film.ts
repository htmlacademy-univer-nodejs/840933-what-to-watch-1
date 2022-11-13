import { Genre } from '../../../types/genre.type';

export class CreateFilmDto {
  name!: string;
  description!: string;
  publicationDate!: Date;
  genre!: Genre;
  releaseYear!: number;
  rating!: number;
  previewLink!: string;
  videoLink!: string;
  actors!: string[];
  producer!: string;
  duration!: number;
  commentCount!: number;
  poster!: string;
  backgroundImage!: string;
  backgroungColor!: string;
}
