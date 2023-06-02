import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RESPONSE_STATUS } from 'src/shared/statuses';
import { ProductService } from 'src/product/product.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier) private supplierRepository: Repository<Supplier>,
    private productService: ProductService,
    private userService:UsersService
  ) { }
  async create(createSupplierDto: CreateSupplierDto,userPayload) {
    const user = await this.userService.findOne(userPayload.sub)
    createSupplierDto.user=user
    const supplier = await this.supplierRepository.create(createSupplierDto)
    return this.supplierRepository.save(supplier)
  }

  findAll():Promise<Supplier[]> {
    return this.supplierRepository.find();
  }
  fullTextSearch(term:string):Promise<Supplier[]> {
    return this.supplierRepository
    .createQueryBuilder()
    .select()
    .where(`code like '%' || :searchTerm ||'%' `,{searchTerm:term})
    .orWhere(`UPPER(name) like '%' ||UPPER(:searchTerm) ||'%' `,{searchTerm:term}) 
    .orWhere(`UPPER(email) like '%' ||UPPER(:searchTerm) ||'%' `,{searchTerm:term})
    .orWhere(`UPPER(address) like '%' ||UPPER(:searchTerm) ||'%'`,{searchTerm:term})
    .orWhere(`phone like '%' || :searchTerm ||'%'`,{searchTerm:term})
    .getMany();
  }

  findOne(id: string):Promise<Supplier> {
    return this.supplierRepository.findOneBy({ id });
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.supplierRepository.preload({ id, ...updateSupplierDto })
    if (!supplier) return { status: RESPONSE_STATUS.SUPPLIER_DOESNT_EXIST }
    this.supplierRepository.save(supplier)
    return { status: RESPONSE_STATUS.GOOD_RESPONSE }
  }

  async remove(id: string) {
    await this.productService.removeSupplier(id)
    await this.supplierRepository.delete({ id })
    return { status: RESPONSE_STATUS.GOOD_RESPONSE }
  }
}
