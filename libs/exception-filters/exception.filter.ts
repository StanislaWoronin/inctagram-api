import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const errorResponse = {
      errors: exception.getError(),
    };
    return of(errorResponse);
  }
}
