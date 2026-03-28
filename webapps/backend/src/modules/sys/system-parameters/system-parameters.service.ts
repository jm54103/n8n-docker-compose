import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { SystemParameter } from './entities/system-parameter.entity';
import { CreateSystemParameterDto, UpdateSystemParameterDto } from './dto';


@Injectable()
export class SystemParametersService {
  private readonly logger = new Logger(SystemParametersService.name);
  private readonly CACHE_PREFIX = 'sys_param:';
  private readonly LIST_CACHE_KEY = 'sys_params:all'; // Key สำหรับเก็บรายการทั้งหมด
  private readonly TTL = 3600; // 1 ชั่วโมง

  constructor(
    @InjectRepository(SystemParameter)
    private readonly paramRepo: Repository<SystemParameter>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async create(dto: CreateSystemParameterDto) {
    const existing = await this.paramRepo.findOne({ where: { paramKey: dto.paramKey } });
    if (existing) throw new ConflictException('Parameter key already exists');

    const param = this.paramRepo.create(dto);
    const saved = await this.paramRepo.save(param);
    
    // ⚡ เมื่อ Create ใหม่ ต้องล้าง Cache รายการทั้งหมด (findAll)
    await this.redis.del(this.LIST_CACHE_KEY);
    return saved;
  }

  async findAll() {
    // 1. ลองดึงจาก Cache ก่อน
    const cachedList = await this.redis.get(this.LIST_CACHE_KEY);
    if (cachedList) {
      this.logger.debug('🎯 Cache Hit for findAll');
      return JSON.parse(cachedList);
    }

    // 2. ถ้าไม่มี ให้ดึงจาก DB
    this.logger.debug('🔍 Cache Miss for findAll, fetching from DB...');
    const params = await this.paramRepo.find();

    // 3. เก็บลง Redis
    if (params.length > 0) {
      await this.redis.set(this.LIST_CACHE_KEY, JSON.stringify(params), 'EX', this.TTL);
    }
    return params;
  }

  // ปรับปรุง findOne ให้ใช้ Cache ด้วย (ดึงด้วย ID)
  async findOne(id: number) {
    const cacheKey = `${this.CACHE_PREFIX}id:${id}`;
    
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      this.logger.debug(`🎯 Cache Hit for ID: ${id}`);
      return JSON.parse(cached);
    }

    const param = await this.paramRepo.findOne({ where: { paramId: id } });
    if (!param) throw new NotFoundException('Parameter not found');

    await this.redis.set(cacheKey, JSON.stringify(param), 'EX', this.TTL);
    return param;
  }

  async getValue(key: string): Promise<any> {
    const cacheKey = `${this.CACHE_PREFIX}key:${key}`;

    const cachedValue = await this.redis.get(cacheKey);
    if (cachedValue !== null) {
      this.logger.debug(`🎯 Cache Hit for key: ${key}`);
      return this.parseValue(cachedValue);
    }

    const param = await this.paramRepo.findOne({ where: { paramKey: key } });
    if (!param) throw new NotFoundException(`Parameter ${key} not found`);

    const value = param.getTypedValue();
    await this.redis.set(cacheKey, JSON.stringify(value), 'EX', this.TTL);

    return value;
  }

  async update(id: number, dto: UpdateSystemParameterDto) {
    const param = await this.paramRepo.findOne({ where: { paramId: id } });
    if (!param) throw new NotFoundException('Parameter not found');

    const oldKey = param.paramKey;
    Object.assign(param, dto);
    const updated = await this.paramRepo.save(param);

    // 🔥 Cache Invalidation: ล้างทุกอย่างที่เกี่ยวข้อง
    const keysToDel = [
      `${this.CACHE_PREFIX}id:${id}`,           // ลบ Cache รายตัวด้วย ID
      `${this.CACHE_PREFIX}key:${oldKey}`,      // ลบ Cache Value ด้วย Key เก่า
      this.LIST_CACHE_KEY                       // ลบ Cache รายการทั้งหมด
    ];

    if (dto.paramKey) {
      keysToDel.push(`${this.CACHE_PREFIX}key:${dto.paramKey}`); // ลบ Key ใหม่ถ้ามีการเปลี่ยนชื่อ
    }

    await this.redis.del(...keysToDel);
    
    return updated;
  }

  private parseValue(val: string) {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
}