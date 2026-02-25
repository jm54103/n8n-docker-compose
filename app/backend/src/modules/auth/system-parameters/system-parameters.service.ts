import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemParameter } from './entities/system-parameter.entity';
import { CreateSystemParameterDto, UpdateSystemParameterDto } from './dto';

@Injectable()
export class SystemParametersService {
  constructor(
    @InjectRepository(SystemParameter)
    private readonly paramRepo: Repository<SystemParameter>,
  ) {}

  async create(dto: CreateSystemParameterDto) {
    const existing = await this.paramRepo.findOne({ where: { paramKey: dto.paramKey } });
    if (existing) throw new ConflictException('Parameter key already exists');

    const param = this.paramRepo.create(dto);
    return await this.paramRepo.save(param);
  }

  async findAll() {
    return await this.paramRepo.find();
  }

  // ฟังก์ชันสำคัญสำหรับดึงค่าไปใช้งานใน Service อื่น
  async getValue(key: string): Promise<string | number | boolean> {
    const param = await this.paramRepo.findOne({ where: { paramKey: key } });
    if (!param) throw new NotFoundException(`Parameter ${key} not found`);
    return param.getTypedValue();
  }

  async update(id: number, dto: UpdateSystemParameterDto) {
    const param = await this.paramRepo.findOne({ where: { paramId: id } });
    if (!param) throw new NotFoundException('Parameter not found');
    
    Object.assign(param, dto);
    return await this.paramRepo.save(param);
  }
}