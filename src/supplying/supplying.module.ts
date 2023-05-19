import { Module } from '@nestjs/common';
import { SupplyingService } from './supplying.service';
import { SupplyingController } from './supplying.controller';
import { Supplying } from './entities/supplying.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Supplying]), ],
  controllers: [SupplyingController],
  providers: [SupplyingService]
})
export class SupplyingModule {}
