import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { ProfilesController, UsersController } from './users.controller';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UserEntity } from 'src/database/entities/user.entity';
import { EmailActivationEntity } from 'src/database/entities/email_activation.entity';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, EmailActivationEntity])],
  controllers: [UsersController, ProfilesController],
  providers: [
		UsersService,
		// {
		// 	provide: APP_GUARD,
		// 	useClass: JwtAuthGuard,
		// }
	],
})
export class UsersModule {}
