import { Injectable, Logger, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { GetUserDto } from './dto/get-user.dto';
import { UserEntity } from 'src/database/entities/user.entity';

export interface TokenPayload { 
	sub: number,
	username: string 
}

@Injectable()
export class UserService {
  private user: UserEntity[];
	logger: Logger;

	constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,				 
	) {
		
	}	

	async getUserSocial(payload: TokenPayload): Promise<GetUserDto> {
		let user = await this.userRepo.findOne(+payload.sub,{
      relations: ['profilePic', 'coverPhoto', 'basicInfo', 'stories', 'photos']
    });

		return user;		
  }
}
