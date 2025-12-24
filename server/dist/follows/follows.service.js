"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const follow_entity_1 = require("../entities/follow.entity");
const user_entity_1 = require("../entities/user.entity");
let FollowsService = class FollowsService {
    constructor(followsRepository, usersRepository) {
        this.followsRepository = followsRepository;
        this.usersRepository = usersRepository;
    }
    async follow(followerId, followingId) {
        if (followerId === followingId) {
            throw new common_1.BadRequestException('Cannot follow yourself');
        }
        const following = await this.usersRepository.findOne({
            where: { id: followingId },
        });
        if (!following) {
            throw new common_1.NotFoundException(`User with ID ${followingId} not found`);
        }
        const existingFollow = await this.followsRepository.findOne({
            where: { follower_id: followerId, following_id: followingId },
        });
        if (existingFollow) {
            throw new common_1.BadRequestException('Already following this user');
        }
        const follow = this.followsRepository.create({
            follower_id: followerId,
            following_id: followingId,
        });
        await this.usersRepository.increment({ id: followerId }, 'following_count', 1);
        await this.usersRepository.increment({ id: followingId }, 'followers_count', 1);
        return this.followsRepository.save(follow);
    }
    async unfollow(followerId, followingId) {
        const follow = await this.followsRepository.findOne({
            where: { follower_id: followerId, following_id: followingId },
        });
        if (!follow) {
            throw new common_1.NotFoundException('Follow relationship not found');
        }
        await this.followsRepository.remove(follow);
        await this.usersRepository.decrement({ id: followerId }, 'following_count', 1);
        await this.usersRepository.decrement({ id: followingId }, 'followers_count', 1);
    }
    async isFollowing(followerId, followingId) {
        const follow = await this.followsRepository.findOne({
            where: { follower_id: followerId, following_id: followingId },
        });
        return !!follow;
    }
};
exports.FollowsService = FollowsService;
exports.FollowsService = FollowsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(follow_entity_1.Follow)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FollowsService);
//# sourceMappingURL=follows.service.js.map