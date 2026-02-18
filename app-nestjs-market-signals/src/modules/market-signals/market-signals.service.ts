import { Injectable} from '@nestjs/common'; // เพิ่มบรรทัดนี้
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketSignal } from '../../entities/market-signal.entity';

@Injectable()
export class MarketSignalsService {
  constructor(
    @InjectRepository(MarketSignal)
    private repo: Repository<MarketSignal>,
  ) {}

  // ดึงข้อมูลทั้งหมด
  findAll() {
    return this.repo.find();
  }

  // ค้นหาเฉพาะสัญลักษณ์
  findBySymbol(symbol: string) {
    return this.repo.findOneBy({ symbol });
  }

  // ตัวอย่าง Query พิเศษ: หาหุ้นที่เป็นขาขึ้น (Golden Cross)
  findBullish() {
    return this.repo.findBy({ golden_cross: true });
  }
}