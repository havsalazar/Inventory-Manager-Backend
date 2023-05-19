import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SupplyingService } from './supplying.service';
import { CreateSupplyingDto } from './dto/create-supplying.dto';
import { UpdateSupplyingDto } from './dto/update-supplying.dto';

@Controller('Supplying')
export class SupplyingController {
  constructor(private readonly SupplyingService: SupplyingService) {}

  @Post()
  create(@Body() createSupplyingDto: CreateSupplyingDto) {
    return this.SupplyingService.create(createSupplyingDto);
  }

  @Get()
  findAll() {
    return this.SupplyingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.SupplyingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupplyingDto: UpdateSupplyingDto) {
    return this.SupplyingService.update(+id, updateSupplyingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.SupplyingService.remove(+id);
  }
}
