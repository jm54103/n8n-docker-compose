import { Repository } from 'typeorm';
import { SystemParameter } from './entities/system-parameter.entity';
import { CreateSystemParameterDto, UpdateSystemParameterDto } from './dto';
export declare class SystemParametersService {
    private readonly paramRepo;
    constructor(paramRepo: Repository<SystemParameter>);
    create(dto: CreateSystemParameterDto): Promise<SystemParameter>;
    findAll(): Promise<SystemParameter[]>;
    getValue(key: string): Promise<string | number | boolean>;
    update(id: number, dto: UpdateSystemParameterDto): Promise<SystemParameter>;
}
