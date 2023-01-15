import typegoose, {
  defaultClasses,
  getModelForClass,
  Ref,
} from '@typegoose/typegoose';
import mongoose from 'mongoose';

import { GENRE_ARRAY, TGenre } from '../../types/types/genre.type.js';
import { UserEntity } from '../user/user.entity.js';

const { prop, modelOptions } = typegoose;

export interface MovieEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'movies',
  },
})
export class MovieEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true })
  public id!: string;

  @prop({ trim: true, required: true, minlength: 2, maxlength: 100 })
  public title!: string;

  @prop({ trim: true, required: true, minlength: 20, maxlength: 1024 })
  public description!: string;

  @prop({ required: true })
  public publishingDate!: Date;

  @prop({
    type: () => String,
    required: true,
    enum: GENRE_ARRAY,
  })
  public genre!: TGenre;

  @prop({ required: true })
  public releaseYear!: number;

  @prop({ required: true, default: 0 })
  public rating!: number;

  @prop({ required: true, trim: true })
  public previewPath!: string;

  @prop({ required: true, trim: true })
  public moviePath!: string;

  @prop({ required: true })
  public actors!: string[];

  @prop({ required: true, minlength: 2, maxlength: 50, trim: true })
  public director!: string;

  @prop({ required: true })
  public duration!: number;

  @prop({ default: 0 })
  public commentsCount!: number;

  @prop({
    type: mongoose.Types.ObjectId,
    ref: UserEntity,
    required: true,
  })
  public user!: Ref<UserEntity>;

  @prop({ required: true, match: /(\S+(\.(jpg|jpeg))$)/, trim: true })
  public posterPath!: string;

  @prop({ required: true, match: /(\S+(\.(jpg|jpeg))$)/, trim: true })
  public backgroundImagePath!: string;

  @prop({ required: true, trim: true })
  public backgroundColor!: string;

  @prop()
  public isPromo?: boolean;
}

export const MovieModel = getModelForClass(MovieEntity);
