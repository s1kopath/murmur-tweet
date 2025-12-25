import { UsersService } from "./users.service";
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getMe(req: any): Promise<any>;
    getAll(): Promise<Omit<import("../entities/user.entity").User, "password">[]>;
    getProfile(id: number): Promise<any>;
}
