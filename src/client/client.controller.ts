import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Public } from 'src/shared/ispublic.metadata';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Client')


@Controller('client')
export class ClientController {
  constructor(
    private readonly clientService: ClientService
    ) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto,@Req() request) { 
    return this.clientService.create(createClientDto,request['user']);
  }
  @ApiBearerAuth('jwt-auth')
  @Get()
  findAll() {
    return this.clientService.findAll();
  }
  @ApiBearerAuth('jwt-auth')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }
  @ApiBearerAuth('jwt-auth')
  @Get('full-text-search/:term')
  fullTextSearch(@Param('term') term: string){
    return this.clientService.fullTextSearch(term);
  }

  @ApiBearerAuth('jwt-auth')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(id, updateClientDto);
  }
  @ApiBearerAuth('jwt-auth')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }

  @Public()
  @Post('createMany')
  initialize(@Body() createClientDto:CreateClientDto[] ){
    return this.clientService.createMany(createClientDto);
  }

}
