import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { ModuleRef, ContextIdFactory } from '@nestjs/core';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
		private authService: AuthService,
		private moduleRef: ModuleRef
	) {
		super({ 
			usernameField: 'email',
		})
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      // throw new UnauthorizedException();	
			throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED); 		
    }
    return user;
  }

}
