import {
	HttpStatus,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (
      exception instanceof UnauthorizedException ||
      exception instanceof ForbiddenException
    ) {
      // request.flash('loginError', 'Please try again!');
      // response.redirect('/');
			response.status(HttpStatus.UNAUTHORIZED).json({ code: 400, msg: 'Unauthorized' });
    } else {
      // response.redirect('/error');
			response.status(HttpStatus.UNAUTHORIZED).json({ code: 400, msg: 'Unauthorized' });
    }
  }
}