import {
  ArgumentsHost,
  Catch,
  HttpStatus,
  RpcExceptionFilter,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch()
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errorResponse = { errors: exception };

    console.log(exception);
    if (exception.getError() === 'Unauthorized') {
      response.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
    return;
  }
}
