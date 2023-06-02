import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ConsoleLogger, UseInterceptors } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('supplier')
@UseInterceptors(CacheInterceptor)

export class SupplierController {
  constructor(private readonly supplierService: SupplierService) { }
  private readonly logger = new ConsoleLogger("database");
  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto, @Req() request) {
    return this.supplierService.create(createSupplierDto,request['user']);
  }

  @Get()
  findAll(@Req() request) {
    // this.logger.log(request)
    return this.supplierService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(id);
  }
  @Get('full-text-search/:term')
  fullTextSearch(@Param('term') term: string){
    return this.supplierService.fullTextSearch(term);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto, @Req() request) {
    return this.supplierService.update(id, updateSupplierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request) {
    return this.supplierService.remove(id);
  }
}
