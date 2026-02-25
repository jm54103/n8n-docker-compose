import { CreateSystemParameterDto } from './create-system-parameter.dto';
declare const UpdateSystemParameterDto_base: import("@nestjs/mapped-types").MappedType<Partial<Pick<CreateSystemParameterDto, "paramValue" | "valueType" | "description">>>;
export declare class UpdateSystemParameterDto extends UpdateSystemParameterDto_base {
}
export {};
