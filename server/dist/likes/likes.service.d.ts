import { Repository } from 'typeorm';
import { Like } from '../entities/like.entity';
import { Murmur } from '../entities/murmur.entity';
export declare class LikesService {
    private likesRepository;
    private murmursRepository;
    constructor(likesRepository: Repository<Like>, murmursRepository: Repository<Murmur>);
    like(userId: number, murmurId: number): Promise<Like>;
    unlike(userId: number, murmurId: number): Promise<void>;
    isLiked(userId: number, murmurId: number): Promise<boolean>;
    getUserLikedMurmurs(userId: number): Promise<number[]>;
}
