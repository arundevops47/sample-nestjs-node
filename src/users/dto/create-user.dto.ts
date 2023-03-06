import { PickType } from '@nestjs/swagger';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';
import { UserEntity } from 'src/database/entities/user.entity';
import { CreateProfileDto } from './create-profile.dto';
import { IsNotEmpty, IsEmail } from 'class-validator';

enum Permission {
  ADMIN = 'Super admin',
  STORE_OWNER = 'Store owner',
  STAFF = 'Staff',
	USER = 'User',
  CUSTOMER = 'Customer',
}

export class CreateUserDto extends PickType(UserEntity, [
  'firstName',
	'lastName',
  'email',
  'password',
]) {
	@IsNotEmpty()  firstName: string;
	@IsNotEmpty()  lastName: string;
	@IsNotEmpty()  @IsEmail() email: string;	
	@IsNotEmpty()  password: string;
  address: CreateAddressDto[];
  profile: CreateProfileDto;
  permission: Permission = Permission.USER;
}
