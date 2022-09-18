import { readFileSync } from 'fs';
import { FileReaderInterface } from './file-reader.interface.js';
import { Film } from '../../types/film.type.js';
import { GenreEnum } from '../../types/genre.enum.js';
import { stringOfLength } from '../../types/string-of-length.type.js';
import { GenreType } from '../../types/genre.enum.js';
import { NonNegative } from '../../types/non-negative-number.type.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) { }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): Film[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([
        name,
        description,
        publicationDate,
        genre,
        releaseYear,
        rating,
        previewLink,
        videoLink,
        actors,
        producer,
        duration,
        commentCount,
        userName,
        email,
        avatarPath,
        password,
        poster,
        backgroundImage,
        backgroungColor
      ]) => ({
        name: stringOfLength(name, 2, 100),
        description: stringOfLength(description, 20, 1024),
        publicationDate,
        genre: GenreEnum[genre as GenreType],
        releaseYear: parseInt(releaseYear, 10) as NonNegative<number>,
        rating: parseInt(rating, 10) as NonNegative<number>,
        previewLink,
        videoLink,
        actors: actors.split(','),
        producer: stringOfLength(producer, 2, 50),
        duration: parseInt(duration, 10) as NonNegative<number>,
        commentCount: parseInt(commentCount, 10) as NonNegative<number>,
        user: {
          name: stringOfLength(userName, 1, 15),
          email,
          avatarPath,
          password: stringOfLength(password, 6, 12)
        },
        poster,
        backgroundImage,
        backgroungColor
      }));
  }
}
