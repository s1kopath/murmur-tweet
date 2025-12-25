"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MurmursModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const murmurs_service_1 = require("./murmurs.service");
const murmurs_controller_1 = require("./murmurs.controller");
const murmur_entity_1 = require("../entities/murmur.entity");
const follow_entity_1 = require("../entities/follow.entity");
const like_entity_1 = require("../entities/like.entity");
let MurmursModule = class MurmursModule {
};
exports.MurmursModule = MurmursModule;
exports.MurmursModule = MurmursModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([murmur_entity_1.Murmur, follow_entity_1.Follow, like_entity_1.Like])],
        controllers: [murmurs_controller_1.MurmursController],
        providers: [murmurs_service_1.MurmursService],
        exports: [murmurs_service_1.MurmursService],
    })
], MurmursModule);
//# sourceMappingURL=murmurs.module.js.map