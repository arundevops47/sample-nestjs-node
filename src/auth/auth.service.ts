import { Injectable, Logger, Request } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import {
  LoginResponse,
  ChangePasswordDto,
  ForgetPasswordDto,
  LoginDto,
  CoreResponse,
  RegisterDto,
} from './dto/create-auth.dto';
import { GetUserDto } from 'src/users/dto/get-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwtPayload.interface';
import { UserEntity } from 'src/database/entities/user.entity';
import { EmailActivationEntity } from 'src/database/entities/email_activation.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  private users: UserEntity[];
	logger: Logger;

	constructor(
    @InjectRepository(UserEntity)
    private usersRepo: Repository<UserEntity>,		
		@InjectRepository(EmailActivationEntity)
		private emailService: EmailService,
		private readonly jwtService: JwtService,
	) {
		this.logger = new Logger();
	}

  async register(createUserInput: RegisterDto): Promise<CoreResponse> {
		let result = await this.usersRepo.findOne({ email: createUserInput.email });
		
		if(result) {
			return {
				status: 400,
				success: false,
				msg: 'email-already-exit',
			};
		}
		else {
			const salt = await bcrypt.genSalt()
			let hash = await bcrypt.hash(createUserInput.password, salt)

			const userData = {
				firstName: createUserInput.firstName,
				lastName: createUserInput.lastName,
				fullName: createUserInput.firstName+' '+createUserInput.lastName,
				email: createUserInput.email,
				password: hash,
				roleId: createUserInput.permission != undefined && createUserInput.permission == "store_owner" ? 2 : 3,
				createdAt: new Date(),
				updatedAt: new Date(),
			}
	
			const createdUser = await this.usersRepo.save(userData);

			let site = createUserInput.site == undefined ? "store" : createUserInput.site;
			await this.emailService.sendVerificationLink(createdUser, site);

			return {
				status: 200,
				success: true,
				msg: 'please-verify-email',
			};			
		}

  }

	async validateUser(email: string, pass: string): Promise<any> {
		let user = await this.usersRepo.createQueryBuilder('users').addSelect("users.password").where({ email: email }).getOne();

    if (user) {
			const isMatch = await bcrypt.compare(pass, user.password);
			
			if(isMatch) {
				const { password, ...result } = user;
				return result;
			}
			return null;
    }
    return null;
  }

  async login(req: LoginDto): Promise<LoginResponse> {
		let user = await this.usersRepo.createQueryBuilder('users').addSelect("users.password").where({ email: req.email }).getOne();
		if(user) {	
			if(user.emailVerified) {
				const isMatch = await bcrypt.compare(req.password, user.password);

				if(isMatch) {
					let role = 'store_owner';
					if(user.roleId == 1) {
						role = 'admin';
					}
	
					const payload = { username: user.email, sub: user.id };
	
					return {
						status: 200,
						msg: 'success',					
						token: this.jwtService.sign(payload),
						permissions: [role],
					};
				}
	
				return {
					status: 400,
					msg: 'password-did-not-match',					
					token: '',
					permissions: [],
				};
			}
			else {
				return {
					status: 400,
					msg: 'verify-your-email',					
					token: '',
					permissions: [],
				};
			}
		}
		else {
			return {
				status: 400,
				msg: 'error-credential-wrong',					
				token: '',
				permissions: [],
			};
		}
  }

  async changePassword(changePasswordInput: ChangePasswordDto): Promise<CoreResponse> {
    return {
			status: 200,
      success: true,
      msg: 'Password change successful',
    };
  }

  async forgetPassword(forgetPasswordInput: ForgetPasswordDto): Promise<CoreResponse> {
		let user = await this.usersRepo.findOne({ email: forgetPasswordInput.email });

		if(user != undefined) {
			let site = forgetPasswordInput.site == undefined ? "store" : forgetPasswordInput.site;
			await this.emailService.sendResetPasswordLink(user, site);
			return {
				status: 200,
				success: true,
				msg: 'reset-password-link-sent',
			};
		}
		else {
			return {
				status: 400,
				success: false,
				msg: 'email-does-not-exist',
			};
		}
  }

}
