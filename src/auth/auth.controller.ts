import { Controller, Get, Post, Body, Req, Request, UseGuards, HttpCode, UseFilters } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ForgetPasswordDto,
  LoginDto,
  OtpDto,
  OtpLoginDto,
  RegisterDto,
  ResetPasswordDto,
  SocialLoginDto,
  VerifyForgetPasswordDto,
  VerifyOtpDto,
	VerifyEmailDto,
	EmailVerificationDto
} from './dto/create-auth.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from './interfaces/requestWithUser.interface';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { AuthExceptionFilter } from '../common/filters/auth-exceptions.filter';

@Controller()
@UseFilters(new AuthExceptionFilter())
export class AuthController {
  constructor(
		private readonly authService: AuthService,
	) {}

  @Post('register')
  createAccount(@Body() req: RegisterDto) {
    return this.authService.register(req);
  }

	@Post('verify-email')
  verifyEmail(@Body() req: VerifyEmailDto) {
    return this.authService.verifyEmail(req);
  }	

	@Post('resend-confirmation-link')
  resendConfirmationLink(@Req() req: EmailVerificationDto) {
    // return this.authService.resendConfirmationLink(req);
  }
	
  @Post('login')
	@UseGuards(LocalAuthGuard)
  login(@Body() req: LoginDto) {
    return this.authService.login(req);
  }

	@UseGuards(JwtAuthGuard)
	@Post('logout')
  async logout(): Promise<boolean> {
    return true;
  }


  @Post('social-login-token')
  socialLogin(@Body() req: SocialLoginDto) {
    return this.authService.socialLogin(req);
  }

  @Post('otp-login')
  otpLogin(@Body() req: OtpLoginDto) {
    return this.authService.otpLogin(req);
  }

  @Post('send-otp-code')
  sendOtpCode(@Body() req: OtpDto) {
    return this.authService.sendOtpCode(req);
  }

  @Post('verify-otp-code')
  verifyOtpCode(@Body() req: VerifyOtpDto) {
    return this.authService.verifyOtpCode(req);
  }

  @Post('forget-password')
  forgetPassword(@Body() body: ForgetPasswordDto) {
    return this.authService.forgetPassword(body);
  }

  @Post('reset-password')
  resetPassword(@Body() req: ResetPasswordDto) {
    return this.authService.resetPassword(req);
  }

  @Post('change-password')
  changePassword(@Body() req: ChangePasswordDto) {
    return this.authService.changePassword(req);
  }

  @Post('verify-forget-password-token')
  verifyForgetPassword(
    @Body() req: VerifyForgetPasswordDto,
  ) {
    return this.authService.verifyForgetPasswordToken(req);
  }

	@UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req) {
		return this.authService.me(req.user);
  }

  @Post('add-points')
  addWalletPoints(@Body() addPointsDto: any) {
    // return this.authService.me();
  }
	
  @Post('contact-us')
  contactUs(@Body() addPointsDto: any) {
    return {
			status: 200,
      success: true,
      msg: 'Thank you for contacting us. We will get back to you soon.',
    };
  }
}
