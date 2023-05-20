import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'; 

@Injectable()
export class ClientService {
  constructor(@InjectRepository(Client)
  private clientRepository: Repository<Client>,) { }
  async create(createClientDto: CreateClientDto) {
    const client = this.clientRepository.create(createClientDto) 
    return await this.clientRepository.save(client);
  }

  async findAll(): Promise<Array<Client>> {
    return await this.clientRepository.find({
      relations: { user: true },
      select: { 
        user: { fullName: true, email: true, id: true } },
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
