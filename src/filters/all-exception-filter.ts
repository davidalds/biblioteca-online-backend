import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ZodError, ZodIssue } from 'zod';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let response;

    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      response = exception.getResponse();

      if (status === HttpStatus.BAD_REQUEST) {
        if (Object.keys(response).includes('error')) {
          if (response.error instanceof ZodError) {
            const formattedErrors = response.error.flatten(
              (issue: ZodIssue) => ({
                message: issue.message,
              })
            );
            response = formattedErrors;
          }
        }
      }
    } else {
      response = HttpException.createBody(
        '',
        'Ocorreu um erro no servidor',
        500
      );
    }

    const responseBody = {
      status,
      method: httpAdapter.getRequestMethod(ctx.getRequest()),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      response,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
