import dayjs from 'dayjs';

import { GENRE_ARRAY } from '../../types/types/genre.type.js';
import { MockData } from '../../types/types/mock-data.type.js';
import {
  getRandomItem,
  getRandomItems,
  getRandomValue,
} from '../../utils/random.js';
import { MovieGeneratorInterface } from './movieGenerator.interface.js';
import {
  FIRST_WEEK_DAY,
  LAST_WEEK_DAY,
  MIN_RELEASE_YEAR,
  MAX_RELEASE_YEAR,
  MIN_RATING,
  MAX_RATING,
  MIN_DURATION,
  MAX_DURATION,
} from '../../utils/movieGenerator.consts.js';

export class MovieGenerator implements MovieGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const publishingDate = dayjs()
      .subtract(getRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const genre = getRandomItem(GENRE_ARRAY);
    const releaseYear = getRandomValue(MIN_RELEASE_YEAR, MAX_RELEASE_YEAR);
    const rating = getRandomValue(MIN_RATING, MAX_RATING, 1);
    const previewPath = getRandomItem<string>(this.mockData.previewPaths);
    const moviePath = getRandomItem<string>(this.mockData.moviePaths);
    const actors = getRandomItems<string>(this.mockData.actors).join(';');
    const director = getRandomItem<string>(this.mockData.directors);
    const duration = getRandomValue(MIN_DURATION, MAX_DURATION);
    const userName = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const posterPath = getRandomItem<string>(this.mockData.posterPaths);
    const backgroundImagePath = getRandomItem<string>(
      this.mockData.backgroundImagePaths
    );
    const backgroundColor = getRandomItem<string>(
      this.mockData.backgroundColors
    );

    return [
      title,
      description,
      publishingDate,
      genre,
      releaseYear,
      rating,
      previewPath,
      moviePath,
      actors,
      director,
      duration,
      userName,
      email,
      posterPath,
      backgroundImagePath,
      backgroundColor,
    ].join('\t');
  }
}
