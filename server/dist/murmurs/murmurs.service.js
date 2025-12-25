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
exports.MurmursService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const murmur_entity_1 = require("../entities/murmur.entity");
const follow_entity_1 = require("../entities/follow.entity");
let MurmursService = class MurmursService {
    constructor(murmursRepository, followsRepository) {
        this.murmursRepository = murmursRepository;
        this.followsRepository = followsRepository;
    }
    async create(userId, createMurmurDto) {
        const murmur = this.murmursRepository.create({
            ...createMurmurDto,
            user_id: userId,
        });
        return this.murmursRepository.save(murmur);
    }
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await this.murmursRepository.findAndCount({
            relations: ["user"],
            order: { created_at: "DESC" },
            skip,
            take: limit,
        });
        return { data, total, page, limit };
    }
    async findOne(id) {
        const murmur = await this.murmursRepository.findOne({
            where: { id },
            relations: ["user"],
        });
        if (!murmur) {
            throw new common_1.NotFoundException(`Murmur with ID ${id} not found`);
        }
        return murmur;
    }
    async findByUserId(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await this.murmursRepository.findAndCount({
            where: { user_id: userId },
            relations: ["user"],
            order: { created_at: "DESC" },
            skip,
            take: limit,
        });
        return { data, total, page, limit };
    }
    async remove(id, userId) {
        const murmur = await this.findOne(id);
        if (murmur.user_id !== userId) {
            throw new common_1.ForbiddenException("You can only delete your own murmurs");
        }
        await this.murmursRepository.remove(murmur);
    }
    async getTimeline(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const follows = await this.followsRepository.find({
            where: { follower_id: userId },
            select: ["following_id"],
        });
        const followingIds = follows.map((f) => f.following_id);
        if (followingIds.length === 0) {
            return { data: [], total: 0, page, limit };
        }
        const queryBuilder = this.murmursRepository
            .createQueryBuilder("murmur")
            .leftJoinAndSelect("murmur.user", "user")
            .where("murmur.user_id IN (:...ids)", { ids: followingIds })
            .orderBy("murmur.created_at", "DESC")
            .skip(skip)
            .take(limit);
        const [data, total] = await queryBuilder.getManyAndCount();
        return { data, total, page, limit };
    }
};
exports.MurmursService = MurmursService;
exports.MurmursService = MurmursService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(murmur_entity_1.Murmur)),
    __param(1, (0, typeorm_1.InjectRepository)(follow_entity_1.Follow)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MurmursService);
//# sourceMappingURL=murmurs.service.js.map