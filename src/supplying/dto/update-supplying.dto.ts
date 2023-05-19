import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplyingDto } from './create-supplying.dto';

export class UpdateSupplyingDto extends PartialType(CreateSupplyingDto) {}
