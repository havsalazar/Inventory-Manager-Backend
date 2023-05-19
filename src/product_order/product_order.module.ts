import { Module } from '@nestjs/common';
import { ProductOrderService } from './product_order.service';
import { ProductOrderController } from './product_order.controller';
import { ProductOrder } from './entities/product_order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrder]), ],
  controllers: [ProductOrderController],
  providers: [ProductOrderService]
})
export class ProductOrderModule {}
