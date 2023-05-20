import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from 'src/stock/entities/stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product,Stock]), ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
