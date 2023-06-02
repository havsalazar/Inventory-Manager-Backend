import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'; 
import { UsersService } from 'src/users/users.service';
import { RESPONSE_STATUS } from 'src/shared/statuses';
import {chunkArray} from 'src/shared/common.functions'
@Injectable()
export class ClientService {
  constructor(@InjectRepository(Client)
  private clientRepository: Repository<Client>,private userService:UsersService) { }

  async create(createClientDto: CreateClientDto,userPayload) {
    const user = await this.userService.findOne(userPayload.sub)
    createClientDto.user=user
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

  findOne(id:string) {
    return this.clientRepository.findOneBy({id})
  }
  fullTextSearch(term:string):Promise<Client[]> {
    return this.clientRepository
    .createQueryBuilder()
    .select()
    .where(`UPPER(fullName) like '%' || UPPER(:searchTerm) ||'%' `,{searchTerm:term})
    .orWhere(`UPPER(plate) like '%' ||UPPER(:searchTerm) ||'%' `,{searchTerm:term}) 
    .orWhere(`UPPER(identification_number) like '%' ||UPPER(:searchTerm) ||'%' `,{searchTerm:term})
    .orWhere(`UPPER(email) like '%' ||UPPER(:searchTerm) ||'%'`,{searchTerm:term})
    .orWhere(`UPPER(phone) like '%' || UPPER(:searchTerm) ||'%'`,{searchTerm:term})
    .getMany();
  }
  async update(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.clientRepository.preload({ id, ...updateClientDto })
    if (!client) return { status: RESPONSE_STATUS.SUPPLIER_DOESNT_EXIST }
    this.clientRepository.save(client)
    return { status: RESPONSE_STATUS.GOOD_RESPONSE }
  }

  async remove(id: string) { 
    await this.clientRepository.delete({ id })
    return { status: RESPONSE_STATUS.GOOD_RESPONSE }
  }
  async createMany(createClientsDto: CreateClientDto[]){
    // await this.clientRepository.createQueryBuilder().insert().values(createClientsDto).execute()

    const chunkedClients=chunkArray(createClientsDto,100)

    chunkedClients.forEach(async clients=>{
      await this.clientRepository.createQueryBuilder().insert().values(clients).execute()
    }) 

    return { status: RESPONSE_STATUS.GOOD_RESPONSE }
  }
}
