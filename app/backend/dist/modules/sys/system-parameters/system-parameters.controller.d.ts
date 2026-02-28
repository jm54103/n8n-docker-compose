import { SystemParametersService } from './system-parameters.service';
import { CreateSystemParameterDto, UpdateSystemParameterDto } from './dto';
export declare class SystemParametersController {
    private readonly paramService;
    constructor(paramService: SystemParametersService);
    create(createDto: CreateSystemParameterDto): Promise<import("./entities/system-parameter.entity").SystemParameter>;
    findAll(): Promise<import("./entities/system-parameter.entity").SystemParameter[]>;
    getValue(key: string): Promise<{
        key: string;
        value: string | number | boolean;
    }>;
    update(id: number, updateDto: UpdateSystemParameterDto): Promise<import("./entities/system-parameter.entity").SystemParameter>;
}
