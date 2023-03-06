import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
	UseGuards,
	Request
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

	@UseGuards(JwtAuthGuard)
  @Get('social')
  getUserSocial(@Request() req) {
		return this.userService.getUserSocial(req.user);
  }

}
