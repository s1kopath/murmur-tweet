import { MurmursService } from './murmurs.service';
import { CreateMurmurDto } from './dto/create-murmur.dto';
export declare class MurmursController {
    private murmursService;
    constructor(murmursService: MurmursService);
    findAll(page: number, limit: number): Promise<{
        data: import("../entities/murmur.entity").Murmur[];
        total: number;
        page: number;
        limit: number;
    }>;
    getTimeline(req: any, page: number, limit: number): Promise<{
        data: import("../entities/murmur.entity").Murmur[];
        total: number;
        page: number;
        limit: number;
    }>;
    findByUserId(userId: number, page: number, limit: number): Promise<{
        data: import("../entities/murmur.entity").Murmur[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number): Promise<import("../entities/murmur.entity").Murmur>;
    create(req: any, createMurmurDto: CreateMurmurDto): Promise<import("../entities/murmur.entity").Murmur>;
    remove(id: number, req: any): Promise<{
        message: string;
    }>;
}
