import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { DatabaseService } from 'src/database/database.service';
import { FilterData } from 'src/database/interfaces/filter-data.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return await this.userRepository.insert(createUserDto);
  }

  async findAll(fillter: FilterData) {
    console.log(fillter);
    const users = await this.databaseService.findWithPagination(
      fillter,
      this.userRepository.createQueryBuilder('users'),
    );
    // console.log(users);

    return users;
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
