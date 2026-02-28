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
exports.UserActivityLogsController = void 0;
const common_1 = require("@nestjs/common");
const user_activity_logs_service_1 = require("./user-activity-logs.service");
let UserActivityLogsController = class UserActivityLogsController {
    constructor(activityService) {
        this.activityService = activityService;
    }
    findAll() {
        return this.activityService.findAll();
    }
    findDetails(table, id) {
        return this.activityService.findByTarget(table, id);
    }
};
exports.UserActivityLogsController = UserActivityLogsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserActivityLogsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('target/:table/:id'),
    __param(0, (0, common_1.Param)('table')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UserActivityLogsController.prototype, "findDetails", null);
exports.UserActivityLogsController = UserActivityLogsController = __decorate([
    (0, common_1.Controller)('user-activity-logs'),
    __metadata("design:paramtypes", [user_activity_logs_service_1.UserActivityLogsService])
], UserActivityLogsController);
//# sourceMappingURL=user-activity-logs.controller.js.map