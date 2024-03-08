import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class CustomRpcExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  private readonly logger = new Logger(CustomRpcExceptionFilter.name);

  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    this.logger.debug('CustomRpcExceptionFilter...');
    this.logger.debug('Exception:' + exception.getError());
    return throwError(() => exception.getError());
  }
}
