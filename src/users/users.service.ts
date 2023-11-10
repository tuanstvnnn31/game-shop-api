import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto);

    return await this.userRepository.insert(createUserDto);
  }

  async findAll(
    fillter: FindOptionsWhere<User>,
    pageitionReq: { limit: number; page: number; offset: number },
  ) {
    console.log(fillter);

    return await this.userRepository.find({
      relations: { role: {} },
      // where: { ...fillter },
      take: pageitionReq.limit,
      skip: pageitionReq.offset,
    });
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
