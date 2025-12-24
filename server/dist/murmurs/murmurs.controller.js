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
exports.MurmursController = void 0;
const common_1 = require("@nestjs/common");
const murmurs_service_1 = require("./murmurs.service");
const create_murmur_dto_1 = require("./dto/create-murmur.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let MurmursController = class MurmursController {
    constructor(murmursService) {
        this.murmursService = murmursService;
    }
    async findAll(page, limit) {
        return this.murmursService.findAll(page, limit);
    }
    async getTimeline(req, page, limit) {
        return this.murmursService.getTimeline(req.user.userId, page, limit);
    }
    async findByUserId(userId, page, limit) {
        return this.murmursService.findByUserId(userId, page, limit);
    }
    async findOne(id) {
        return this.murmursService.findOne(id);
    }
    async create(req, createMurmurDto) {
        return this.murmursService.create(req.user.userId, createMurmurDto);
    }
    async remove(id, req) {
        await this.murmursService.remove(id, req.user.userId);
        return { message: 'Murmur deleted successfully' };
    }
};
exports.MurmursController = MurmursController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MurmursController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('timeline'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], MurmursController.prototype, "getTimeline", null);
__decorate([
    (0, common_1.Get)('users/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], MurmursController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MurmursController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_murmur_dto_1.CreateMurmurDto]),
    __metadata("design:returntype", Promise)
], MurmursController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MurmursController.prototype, "remove", null);
exports.MurmursController = MurmursController = __decorate([
    (0, common_1.Controller)('murmurs'),
    __metadata("design:paramtypes", [murmurs_service_1.MurmursService])
], MurmursController);
//# sourceMappingURL=murmurs.controller.js.map