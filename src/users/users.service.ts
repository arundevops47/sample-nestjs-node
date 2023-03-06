import { Injectable, Logger, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import Fuse from 'fuse.js';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto, UserPaginator } from './dto/get-users.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { paginate } from 'src/common/pagination/paginate';
import { UserEntity } from 'src/database/entities/user.entity';
import { TokenPayload } from 'src/auth/interfaces/tokenPayload.interface';

// import usersJson from './users.json';
// const users = plainToClass(UserEntity, usersJson);

const options = {
  keys: ['firstName', 'lastName', 'email', 'status', 'type.slug', 'categories.slug'],
  threshold: 0.3,
};


@Injectable()
export class UsersService {
  private users: UserEntity[];
	logger: Logger;

	constructor(
    @InjectRepository(UserEntity)
    private usersRepo: Repository<UserEntity>,				 
	) {
		this.logger = new Logger();
	}

  create(createUserDto: CreateUserDto) {
    return this.users[0];
  }

  async getUsers({ text, limit, page }: GetUsersDto): Promise<UserPaginator> {
    if (!page) page = 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

		let users = await this.usersRepo.find({ roleId: Not(1) });	
		const fuse = new Fuse(users, options);

    let data: UserEntity[] = users;
    if (text?.replace(/%/g, '')) {
      data = fuse.search(text)?.map(({ item }) => item);
    }
    const results = data.slice(startIndex, endIndex);
    const url = `/users?limit=${limit}`;

    return {
			status: 200,
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }
	
  findOne(id: number) {
		// return this.users[0];
    return this.users.find((user) => user.id === id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.users[0];
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

	async getUserById(id: number): Promise<GetUserDto> {
		return await this.usersRepo.findOne({ id: id });	
	}

	async block(id: number) {
		let output = await this.usersRepo.update(id, {status: false});
    return output;
  }

	async unblock(id: number) {
		let output = await this.usersRepo.update(id, {status: true});
    return output;
  }	
}
