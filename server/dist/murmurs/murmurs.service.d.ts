import { Repository } from 'typeorm';
import { Murmur } from '../entities/murmur.entity';
import { Follow } from '../entities/follow.entity';
import { CreateMurmurDto } from './dto/create-murmur.dto';
export declare class MurmursService {
    private murmursRepository;
    private followsRepository;
    constructor(murmursRepository: Repository<Murmur>, followsRepository: Repository<Follow>);
    create(userId: number, createMurmurDto: CreateMurmurDto): Promise<Murmur>;
    findAll(page?: number, limit?: number): Promise<{
        data: Murmur[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number): Promise<Murmur>;
    findByUserId(userId: number, page?: number, limit?: number): Promise<{
        data: Murmur[];
        total: number;
        page: number;
        limit: number;
    }>;
    remove(id: number, userId: number): Promise<void>;
    getTimeline(userId: number, page?: number, limit?: number): Promise<{
        data: Murmur[];
        total: number;
        page: number;
        limit: number;
    }>;
}
