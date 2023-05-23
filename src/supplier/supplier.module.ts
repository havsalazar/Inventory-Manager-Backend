import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { Supplier } from './entities/supplier.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entities/product.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { ProductSupplier } from 'src/product/entities/product-supplier.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier,ProductSupplier,Product,Stock,User]),  ],
  controllers: [SupplierController],
  providers: [SupplierService,ProductService,UsersService],
})
export class SupplierModule {}
