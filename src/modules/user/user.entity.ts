import typegoose, {
  defaultClasses,
  getModelForClass,
} from '@typegoose/typegoose';
import { User } from '../../types/types/user.type.js';
import { createSHA256, checkPassword } from '../../utils/crypro.js';
import { DEFAULT_AVATAR_FILE_NAME } from './user.models.js';

const { prop, modelOptions } = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
  },
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(data: User) {
    super();

    this.email = data.email;
    this.avatarPath = data.avatarPath;
    this.name = data.name;
  }

  @prop({ unique: true, required: true })
  public email!: string;

  @prop({ default: DEFAULT_AVATAR_FILE_NAME })
  public avatarPath?: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true, default: [] })
  public mylist!: string[];

  @prop({ required: true })
  private password!: string;

  setPassword(password: string, salt: string) {
    checkPassword(password);
    this.password = createSHA256(password, salt);
  }

  verifyPassword(password: string, salt: string) {
    return createSHA256(password, salt) === this.password;
  }

  getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
