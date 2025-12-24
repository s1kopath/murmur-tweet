import { Repository } from 'typeorm';
import { Follow } from '../entities/follow.entity';
import { User } from '../entities/user.entity';
export declare class FollowsService {
    private followsRepository;
    private usersRepository;
    constructor(followsRepository: Repository<Follow>, usersRepository: Repository<User>);
    follow(followerId: number, followingId: number): Promise<Follow>;
    unfollow(followerId: number, followingId: number): Promise<void>;
    isFollowing(followerId: number, followingId: number): Promise<boolean>;
}
