import { PartialType } from '@nestjs/mapped-types';
import { CreateProductOrderDto } from './create-product_order.dto';

export class UpdateProductOrderDto extends PartialType(CreateProductOrderDto) {}
