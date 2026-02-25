import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemParametersService } from './system-parameters.service';
import { SystemParametersController } from './system-parameters.controller';
import { SystemParameter } from './entities/system-parameter.entity';

@Module({
  imports: [
    // ลงทะเบียน Entity เพื่อให้ TypeORM สร้าง Repository ให้ใช้งาน
    TypeOrmModule.forFeature([SystemParameter]),
  ],
  controllers: [SystemParametersController],
  providers: [SystemParametersService],
  // ต้อง Export เพื่อให้ Module อื่น (เช่น AuthModule) สามารถ Inject Service นี้ไปใช้งานได้
  exports: [SystemParametersService],
})
export class SystemParametersModule {}