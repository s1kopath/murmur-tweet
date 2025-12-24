import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        id: number;
        username: string;
        name: string;
        email: string;
        created_at: Date;
        followers_count: number;
        following_count: number;
        murmurs: import("../entities/murmur.entity").Murmur[];
        following: import("../entities/follow.entity").Follow[];
        followers: import("../entities/follow.entity").Follow[];
        likes: import("../entities/like.entity").Like[];
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            username: string;
            name: string;
            email: string;
        };
    }>;
}
