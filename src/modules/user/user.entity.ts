import typegoose, {defaultClasses, getModelForClass} from '@typegoose/typegoose';

import {User} from '../../types/user.type.js';
import {createSHA256} from '../../utils/crypto.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(data: User) {
    super();

    this.email = data.email;
    this.avatarPath = data.avatarPath;
    this.name = data.name;
  }

  @prop({unique: true, required: true})
  public email!: string;

  @prop()
  public avatarPath?: string;

  @prop({required: true, default: ''})
  public name!: string;

  @prop({required: true, default: ''})
  private password!: string;

  setPassword(password: string, salt: string) {
    if (password.length < 6 && password.length > 12) {
      throw Error('Password length must be between 6 and 12 characters');
    }

    this.password = createSHA256(password, salt);
  }

  getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
