import { StringOfLength } from './string-of-length.type';

export type User = {
    name: StringOfLength<1, 15>;
    email: string;
    avatarPath: string;
    password: StringOfLength<6, 12>;
}
