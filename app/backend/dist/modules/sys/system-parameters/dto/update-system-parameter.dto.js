"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSystemParameterDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_system_parameter_dto_1 = require("./create-system-parameter.dto");
class UpdateSystemParameterDto extends (0, mapped_types_1.PartialType)((0, mapped_types_1.PickType)(create_system_parameter_dto_1.CreateSystemParameterDto, ['paramValue', 'valueType', 'description'])) {
}
exports.UpdateSystemParameterDto = UpdateSystemParameterDto;
//# sourceMappingURL=update-system-parameter.dto.js.map