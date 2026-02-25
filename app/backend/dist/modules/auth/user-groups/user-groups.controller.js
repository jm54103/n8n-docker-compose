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
exports.UserGroupsController = void 0;
const common_1 = require("@nestjs/common");
const user_groups_service_1 = require("./user-groups.service");
const dto_1 = require("./dto");
let UserGroupsController = class UserGroupsController {
    constructor(groupService) {
        this.groupService = groupService;
    }
    create(createDto) {
        return this.groupService.create(createDto);
    }
    findAll() {
        return this.groupService.findAll();
    }
    findOne(id) {
        return this.groupService.findOne(id);
    }
    update(id, updateDto) {
        return this.groupService.update(id, updateDto);
    }
    remove(id) {
        return this.groupService.remove(id);
    }
};
exports.UserGroupsController = UserGroupsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateUserGroupDto]),
    __metadata("design:returntype", void 0)
], UserGroupsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserGroupsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UserGroupsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateUserGroupDto]),
    __metadata("design:returntype", void 0)
], UserGroupsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UserGroupsController.prototype, "remove", null);
exports.UserGroupsController = UserGroupsController = __decorate([
    (0, common_1.Controller)('user-groups'),
    __metadata("design:paramtypes", [user_groups_service_1.UserGroupsService])
], UserGroupsController);
//# sourceMappingURL=user-groups.controller.js.map