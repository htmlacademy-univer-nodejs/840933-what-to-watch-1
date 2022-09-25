import { readFileSync } from 'fs';
import { FileReaderInterface } from './file-reader.interface.js';
import { Film } from '../../types/film.type.js';
import { GenreEnum } from '../../types/genre.enum.js';
import { GenreType } from '../../types/genre.enum.js';

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
        name,
        description,
        publicationDate: new Date(publicationDate),
        genre: GenreEnum[genre as GenreType],
        releaseYear: parseInt(releaseYear, 10),
        rating: parseInt(rating, 10),
        previewLink,
        videoLink,
        actors: actors.split(','),
        producer: producer,
        duration: parseInt(duration, 10),
        commentCount: parseInt(commentCount, 10),
        user: {
          name: userName,
          email,
          avatarPath,
          password
        },
        poster,
        backgroundImage,
        backgroungColor
      }));
  }
}
