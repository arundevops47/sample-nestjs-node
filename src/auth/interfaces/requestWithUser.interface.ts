import { Request } from 'express';
import { UserEntity } from 'src/database/entities/user.entity';
 
export interface RequestWithUser { 
	userId: number 
}

