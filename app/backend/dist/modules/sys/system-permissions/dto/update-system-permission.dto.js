"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSystemPermissionDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_system_permission_dto_1 = require("./create-system-permission.dto");
class UpdateSystemPermissionDto extends (0, mapped_types_1.PartialType)(create_system_permission_dto_1.CreateSystemPermissionDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateSystemPermissionDto = UpdateSystemPermissionDto;
//# sourceMappingURL=update-system-permission.dto.js.map