import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(createUserInput: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserInput);
    return await this.userRepository.save(user);
  }
  async signup(email: string, password: string) {
    const user = this.userRepository.create({ email, password });
    return await this.userRepository.save(user);
  }
  async getUserByEmail(email: string): Promise<User> {

    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      return null;
    }
    return user;

  }

  async findAll(): Promise<Array<User>> {
    return await this.userRepository.find({select:['email','id','fullName','role','suppliers']});
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async update(
    id: string,
    data: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.preload({
      id: id,
      ...data,
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.userRepository.save(user);
  }
  async updateToken(
    id: string,
    data: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.preload({
      id: id,
      ...data,
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.userRepository.save(user);
  }


  async remove(id: string): Promise<any> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { result: 'ok' };
  }
  async init() {
    const userTest = {
      id: 'b4d38370-3023-4c97-bf9e-78ab6bb226e6',
      fullName: 'test1',
      email: 'holi2@gmail.com',
      role: null,
      password: '$argon2id$v=19$m=65536,t=3,p=4$HYOkzlUJyH9Iww2WpIKv3w$sHGUH3ri6esAudO/ThbdvUiGlh3bfjW1eMwLflpW7MM',
      refreshToken: '$argon2id$v=19$m=65536,t=3,p=4$nCZ2WrVPFSIuG1yxERd/9Q$2oxcrwd1C2p78BYhaKdf8SLRazSc7VNhCZODSk0xt2c'
    }
    const user = this.userRepository.create(userTest);
    return await this.userRepository.save(user);
  }
}
