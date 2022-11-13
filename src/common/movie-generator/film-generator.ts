import { MockData } from '../../types/mock-data.type.js';
import {
  getRandomItem,
  getRandomItems,
  getRandomValue,
  getRandomDate,
} from '../../utils/random-function.js';
import { FilmGeneratorInterface } from './film-generator.interface.js';
import {
  MIN_RELEASE_YEAR,
  MAX_RELEASE_YEAR,
  MIN_RATING,
  MAX_RATING,
  MIN_DURATION,
  MAX_DURATION,
} from './film-generator.constants.js';
import { genreArray } from '../../types/genre.type.js';

export default class FilmGenerator implements FilmGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const name = getRandomItem<string>(this.mockData.names);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const publicationDate = getRandomDate(new Date(1895, 0, 1), new Date());
    const genre = getRandomItem(genreArray);
    const releaseYear = getRandomValue(MIN_RELEASE_YEAR, MAX_RELEASE_YEAR);
    const rating = getRandomValue(MIN_RATING, MAX_RATING, 1);
    const previewLink = getRandomItem<string>(this.mockData.previewLinks);
    const videoLink = getRandomItem<string>(this.mockData.videoLinks);
    const actors = getRandomItems<string>(this.mockData.actors).join(',');
    const producer = getRandomItem<string>(this.mockData.producers);
    const duration = getRandomValue(MIN_DURATION, MAX_DURATION);
    const userName = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatarPaths);
    const posterPath = getRandomItem<string>(this.mockData.posterPaths);
    const backgroundImagePath = getRandomItem<string>(
      this.mockData.backgroundImagePaths
    );
    const backgroundColor = getRandomItem<string>(
      this.mockData.backgroundColors
    );

    return [
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
      userName,
      email,
      avatar,
      posterPath,
      backgroundImagePath,
      backgroundColor,
    ].join('\t');
  }
}
