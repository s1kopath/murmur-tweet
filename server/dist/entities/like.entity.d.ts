import { User } from './user.entity';
import { Murmur } from './murmur.entity';
export declare class Like {
    user_id: number;
    murmur_id: number;
    user: User;
    murmur: Murmur;
    created_at: Date;
}
