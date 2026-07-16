import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userDto: Partial<User>): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { username: userDto.username },
    });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const newUser = this.usersRepository.create(userDto);
    return this.usersRepository.save(newUser);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
