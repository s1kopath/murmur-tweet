import { LikesService } from './likes.service';
export declare class LikesController {
    private likesService;
    constructor(likesService: LikesService);
    like(id: number, req: any): Promise<{
        message: string;
    }>;
    unlike(id: number, req: any): Promise<{
        message: string;
    }>;
}
