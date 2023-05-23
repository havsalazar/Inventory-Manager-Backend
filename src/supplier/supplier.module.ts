import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { Supplier } from './entities/supplier.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entities/product.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { ProductSupplier } from 'src/product/entities/product-supplier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier,ProductSupplier,Product,Stock]),  ],
  controllers: [SupplierController],
  providers: [SupplierService,ProductService],
})
export class SupplierModule {}
