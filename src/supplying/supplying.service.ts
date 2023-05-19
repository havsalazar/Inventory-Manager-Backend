import { Injectable } from '@nestjs/common';
import { CreateSupplyingDto } from './dto/create-supplying.dto';
import { UpdateSupplyingDto } from './dto/update-supplying.dto';

@Injectable()
export class SupplyingService {
  create(createSupplyingDto: CreateSupplyingDto) {
    return 'This action adds a new Supplying';
  }

  findAll() {
    return `This action returns all Supplying`;
  }

  findOne(id: number) {
    return `This action returns a #${id} Supplying`;
  }

  update(id: number, updateSupplyingDto: UpdateSupplyingDto) {
    return `This action updates a #${id} Supplying`;
  }

  remove(id: number) {
    return `This action removes a #${id} Supplying`;
  }
}
