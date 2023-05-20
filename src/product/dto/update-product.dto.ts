import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { Stock } from 'src/stock/entities/stock.entity';

export class UpdateProductDto extends PartialType(CreateProductDto) { 
    price?: number
    name?: string
    stock?: Stock
}
