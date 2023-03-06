import { SortOrder } from 'src/common/dto/generic-conditions.dto';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { Paginator } from 'src/common/dto/paginator.dto';
import { UserEntity } from 'src/database/entities/user.entity';

export class UserPaginator extends Paginator<UserEntity> {
  data: UserEntity[];
	status: number;
}

export class GetUsersDto extends PaginationArgs {
  orderBy?: QueryUsersOrderByColumn;
  sortedBy?: SortOrder;
  text?: string;
	search?: string;
}

export enum QueryUsersOrderByColumn {
	FIRST_NAME = 'firstName',
	LAST_NAME = 'lastName',
	EMAIL= 'email',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

