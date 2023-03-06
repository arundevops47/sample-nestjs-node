import { Timestamp } from 'rxjs';
import { Address } from 'src/addresses/entities/address.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
// import { OrderEntity } from 'src/database/entities/order.entity';
import { StoreEntity } from 'src/database/entities/store.entity';
import { Profile } from './profile.entity';

export class UserEntity extends CoreEntity {
  firstName: string;
	lastName: string;
	fullName: string;
  email: string;
  password?: string;
  status?: boolean = true;
	roleId: number;
	createdAt: Date;
	updatedAt: Date;
}
