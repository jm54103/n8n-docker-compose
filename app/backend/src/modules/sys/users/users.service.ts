import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 1. สร้างผู้ใช้งาน (Create)
  async create(userData: Partial<User>): Promise<User> {
    const { passwordHash, ...rest } = userData;
    
    // Hash รหัสผ่านก่อนบันทึก
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(passwordHash, salt);

    const newUser = this.userRepository.create({
      ...rest,
      passwordHash: hashed,
    });

    return await this.userRepository.save(newUser);
  }

  // 2. อ่านข้อมูลทั้งหมด (Read All)
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['group'], // ดึงข้อมูลกลุ่มมาด้วย
    });
  }

  // 3. อ่านข้อมูลรายบุคคล (Read One)
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { userId: id },
      relations: ['group', 'group.permissions'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // 4. แก้ไขข้อมูล (Update)
  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    
    // ถ้ามีการแก้ไขรหัสผ่าน ให้ Hash ใหม่
    if (updateData.passwordHash) {
      const salt = await bcrypt.genSalt();
      updateData.passwordHash = await bcrypt.hash(updateData.passwordHash, salt);
    }

    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  // 5. ลบผู้ใช้งาน (Delete)
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}