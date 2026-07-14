import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SettradeService } from './settrade.service';
import { SettradeController } from './settrade.controller';

@Module({
  imports: [HttpModule],
  providers: [SettradeService],
  controllers: [SettradeController],
})
export class SettradeModule {}