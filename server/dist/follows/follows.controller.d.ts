import { FollowsService } from './follows.service';
export declare class FollowsController {
    private followsService;
    constructor(followsService: FollowsService);
    follow(id: number, req: any): Promise<{
        message: string;
    }>;
    unfollow(id: number, req: any): Promise<{
        message: string;
    }>;
    getFollowStatus(id: number, req: any): Promise<{
        isFollowing: boolean;
    }>;
}
