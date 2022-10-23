import typegoose, {defaultClasses, Ref, getModelForClass} from '@typegoose/typegoose';

import {Genre} from '../../types/genre.type';
import {UserEntity} from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface FilmEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'movies'
  }
})

export class FilmEntity extends defaultClasses.TimeStamps {
  @prop({required: true, minlength: 2, maxlength: 100})
  public name!: string;

  @prop({required: true, minlength: 20, maxlength: 1024})
  public description!: string;

  @prop({required: true})
  public publicationDate!: Date;

  @prop({type: () => String, required: true})
  public genre!: Genre;

  @prop({required: true})
  public releaseYear!: number;

  @prop({required: true})
  public rating!: number;

  @prop({required: true})
  public previewLink!: string;

  @prop({required: true})
  public videoLink!: string;

  @prop({required: true})
  public actors!: string[];

  @prop({required: true, minlength: 2, maxlength: 50})
  public producer!: string;

  @prop({required: true})
  public duration!: number;

  @prop({default: 0})
  public commentCount!: number;

  @prop({ref: UserEntity, required: true})
  public user: Ref<UserEntity>;

  @prop({required: true, match: /(\S+(\.jpg)$)/})
  public poster!: string;

  @prop({required: true, match: /(\S+(\.jpg)$)/})
  public backgroundImage!: string;

  @prop({required: true})
  public backgroungColor!: string;
}

export const FilmModel = getModelForClass(FilmEntity);
