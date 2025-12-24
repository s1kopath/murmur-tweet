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
exports.LikesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const like_entity_1 = require("../entities/like.entity");
const murmur_entity_1 = require("../entities/murmur.entity");
let LikesService = class LikesService {
    constructor(likesRepository, murmursRepository) {
        this.likesRepository = likesRepository;
        this.murmursRepository = murmursRepository;
    }
    async like(userId, murmurId) {
        const murmur = await this.murmursRepository.findOne({
            where: { id: murmurId },
        });
        if (!murmur) {
            throw new common_1.NotFoundException(`Murmur with ID ${murmurId} not found`);
        }
        const existingLike = await this.likesRepository.findOne({
            where: { user_id: userId, murmur_id: murmurId },
        });
        if (existingLike) {
            throw new common_1.BadRequestException('Already liked this murmur');
        }
        const like = this.likesRepository.create({
            user_id: userId,
            murmur_id: murmurId,
        });
        await this.likesRepository.save(like);
        await this.murmursRepository.increment({ id: murmurId }, 'likes_count', 1);
        return like;
    }
    async unlike(userId, murmurId) {
        const like = await this.likesRepository.findOne({
            where: { user_id: userId, murmur_id: murmurId },
        });
        if (!like) {
            throw new common_1.BadRequestException('Like not found');
        }
        await this.likesRepository.remove(like);
        await this.murmursRepository.decrement({ id: murmurId }, 'likes_count', 1);
    }
    async isLiked(userId, murmurId) {
        const like = await this.likesRepository.findOne({
            where: { user_id: userId, murmur_id: murmurId },
        });
        return !!like;
    }
    async getUserLikedMurmurs(userId) {
        const likes = await this.likesRepository.find({
            where: { user_id: userId },
            select: ['murmur_id'],
        });
        return likes.map((like) => like.murmur_id);
    }
};
exports.LikesService = LikesService;
exports.LikesService = LikesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __param(1, (0, typeorm_1.InjectRepository)(murmur_entity_1.Murmur)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LikesService);
//# sourceMappingURL=likes.service.js.map