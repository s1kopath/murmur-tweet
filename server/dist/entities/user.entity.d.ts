import { Murmur } from './murmur.entity';
import { Follow } from './follow.entity';
import { Like } from './like.entity';
export declare class User {
    id: number;
    username: string;
    password: string;
    name: string;
    email: string;
    created_at: Date;
    followers_count: number;
    following_count: number;
    murmurs: Murmur[];
    following: Follow[];
    followers: Follow[];
    likes: Like[];
}
