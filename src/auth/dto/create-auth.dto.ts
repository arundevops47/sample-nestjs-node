import { PartialType, PickType } from '@nestjs/swagger';
import { CoreMutationOutput } from 'src/common/dto/core-mutation-output.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { IsNotEmpty, IsEmail } from 'class-validator';

enum Permission {
  ADMIN = 'admin',
  STORE_OWNER = 'store_owner',
  STAFF = 'staff',
	USER = 'user',
  CUSTOMER = 'customer',
}

export class RegisterDto extends PickType(UserEntity, ['firstName', 'lastName', 'email', 'password']) {
	@IsNotEmpty()  firstName: string;
	@IsNotEmpty()  lastName: string;
	@IsNotEmpty()  @IsEmail() email: string;	
	@IsNotEmpty()  password: string;
	@IsNotEmpty()  site?: string;		
  permission: Permission = Permission.STORE_OWNER;
}

export class LoginDto extends PartialType(
  PickType(UserEntity, ['email', 'password']),
) {}

export class SocialLoginDto {
  provider: string;
  access_token: string;
}

export class ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export class EmailVerificationDto {
  email: string;
}

export class VerifyEmailDto {
  token: string;
}

export class ForgetPasswordDto {
  email: string;
	site?: string;
}

export class VerifyForgetPasswordDto {
  email: string;
  token: string;
}

export class ResetPasswordDto {
  email?: string;
  token: string;
  password: string;
}
export class LoginResponse {
	status: number;
	msg: string;
  token: string;
  permissions: string[];
}

export class CoreResponse extends CoreMutationOutput {}
export class VerifyOtpDto {
  otp_id: string;
  status: string;
  phone_number: string;
}

export class OtpResponse {
  id: string;
  msg: string;
  success: boolean;
  phone_number: string;
  provider: string;
  is_contact_exist: boolean;
}

export class OtpDto {
  phone_number: string;
}

export class OtpLoginDto {
  otp_id: string;
  status: string;
  phone_number: string;
  name?: string;
  email?: string;
}
