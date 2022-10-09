import {MockData} from '../../types/mock-data.type.js';
import {getRandomItem, getRandomItems, getRandomValue} from '../../utils/random-function.js';
import {MovieGeneratorInterface} from './movie-generator.interface.js';
import {
  FIRST_WEEK_DAY,
  LAST_WEEK_DAY,
  MIN_RELEASE_YEAR,
  MAX_RELEASE_YEAR,
  MIN_RATING,
  MAX_RATING,
  MIN_DURATION,
  MAX_DURATION
} from './movie-generator.constants.js';
import dayjs from 'dayjs';
import { genreArray } from '../../types/genre.type.js';

export default class MovieGenerator implements MovieGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const name = getRandomItem<string>(this.mockData.names);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const publicationDate = dayjs().subtract(
      getRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day'
    ).toISOString();
    const genre = getRandomItem(genreArray);
    const releaseYear = getRandomValue(MIN_RELEASE_YEAR, MAX_RELEASE_YEAR);
    const rating = getRandomValue(MIN_RATING, MAX_RATING, 1);
    const previewLink = getRandomItem<string>(this.mockData.previewLinks);
    const videoLink = getRandomItem<string>(this.mockData.videoLinks);
    const actors = getRandomItems<string>(this.mockData.actors).join(';');
    const producer = getRandomItem<string>(this.mockData.producers);
    const duration = getRandomValue(MIN_DURATION, MAX_DURATION);
    const userName = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const password = getRandomItem<string>(this.mockData.passwords);
    const avatar = getRandomItem<string>(this.mockData.avatarPaths);
    const posterPath = getRandomItem<string>(this.mockData.posterPaths);
    const backgroundImagePath = getRandomItem<string>(this.mockData.backgroundImagePaths);
    const backgroundColor = getRandomItem<string>(this.mockData.backgroundColors);

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
      password,
      avatar,
      posterPath,
      backgroundImagePath,
      backgroundColor
    ].join('\t');
  }
}
