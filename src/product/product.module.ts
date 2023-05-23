import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from 'src/stock/entities/stock.entity';
import { ProductSupplier } from './entities/product-supplier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product,Stock,ProductSupplier]), ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
