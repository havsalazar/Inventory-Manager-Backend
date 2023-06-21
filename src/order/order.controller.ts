import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('Order')

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @ApiBearerAuth('jwt-auth')
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }
  @ApiBearerAuth('jwt-auth')
  @Get()
  findAll() {
    return this.orderService.findAll();
  }
  @ApiBearerAuth('jwt-auth')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }
  @ApiBearerAuth('jwt-auth')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }
  @ApiBearerAuth('jwt-auth')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
