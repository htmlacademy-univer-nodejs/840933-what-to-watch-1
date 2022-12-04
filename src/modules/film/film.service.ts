import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { FilmServiceInterface } from './film.interface.js';
import { CreateFilmDto } from './dto/createFilm.dto.js';
import { FilmEntity } from './film.entity.js';
import { Component } from '../../types/component.type.js';
import { Logger } from '../../common/logger/logger.type.js';
import { UpdateFilmDto } from './dto/updateFilm.dto.js';
import { MAX_FILMS } from '../../constants/film.constants.js';

@injectable()
export class FilmService implements FilmServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.FilmModel)
    private readonly filmModel: types.ModelType<FilmEntity>
  ) {}

  async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const film = await this.filmModel.create(dto);
    this.logger.info(`Создан новый фильм: ${dto.name}`);

    return film;
  }

  async findById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findById(filmId).populate('userId');
  }

  async find(): Promise<DocumentType<FilmEntity>[]> {
    return this.filmModel.aggregate([
      {
        $lookup: {
          from: 'comment',
          let: {
            filmId: '$_id'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    '$$filmId',
                    '$films'
                  ]
                }
              }
            },
            {
              $project: {
                _id: 1
              }
            }
          ],
          as: 'comment'
        },
      },
      {
        $addFields: {
          id: {
            $toString: '$_id'
          },
          commentsCount: {
            $size: '$comment'
          },
          rating: {
            $avg: '$comment.rating'
          }
        }
      },
      {
        $unset: 'comment'
      },
      {
        $limit: MAX_FILMS
      }
    ]);
  }

  async updateById(filmId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findByIdAndUpdate(filmId, dto).populate('userId');
  }

  async deleteById(filmId: string): Promise<void | null> {
    return this.filmModel.findByIdAndDelete(filmId);
  }

  async findByGenre(genre: string, limit?: number): Promise<DocumentType<FilmEntity>[]> {
    return this.filmModel.find({genre}, {}, {limit}).populate('userId');
  }

  async findPromo(): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findOne({isPromo: true}).populate('userId');
  }

  async incrementComments(filmId: string): Promise<void | null> {
    return this.filmModel.findByIdAndUpdate(filmId, {
      $inc: {
        commentCount: 1
      }
    });
  }

  async updateRating(filmId: string, newRating: number): Promise<void | null> {
    const currentValues = await this.filmModel.findById(filmId).select('rating commentCount');
    const currentRating = currentValues?.rating ?? 0;
    const currentCommentCount = currentValues?.commentCount ?? 0;

    return this.filmModel.findByIdAndUpdate(filmId, {
      rating: (currentRating * currentCommentCount + newRating) / (currentCommentCount + 1)
    });
  }
}
