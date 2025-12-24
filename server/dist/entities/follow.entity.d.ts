import { User } from './user.entity';
export declare class Follow {
    follower_id: number;
    following_id: number;
    follower: User;
    following: User;
    created_at: Date;
}
