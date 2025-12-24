import { User } from './user.entity';
import { Like } from './like.entity';
export declare class Murmur {
    id: number;
    user_id: number;
    user: User;
    text: string;
    likes_count: number;
    created_at: Date;
    likes: Like[];
}
