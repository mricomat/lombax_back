import { ObjectLiteral } from 'typeorm';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ServerResponse } from 'http';
import { Request } from 'express';
import { CallHandler, ExecutionContext, Logger, NestInterceptor } from '@nestjs/common';

export class LoggingInterceptor implements NestInterceptor {
  protected logger = new Logger(LoggingInterceptor.name);

  protected maskedProperties = ['password'];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (process.env.NODE_ENV === 'test') {
      return next.handle();
    }
    const request = context.switchToHttp().getRequest<Request>();
    const maskedBody = this.maskProperties(request.body);
    this.logger.log(this.createRequestLog(request, maskedBody));
    return next.handle().pipe(
      tap((responseBody: object) => {
        const response: ServerResponse & { body: any } = context.switchToHttp().getResponse();
        this.logger.log(this.createResponseLog(request, response, responseBody));
      }),
    );
  }

  protected createRequestLog(request: Request, requestBody: Record<string, any>) {
    const { url, method, query } = request;
    return `REQUEST ${method} ${url} ---> \n  body: ${JSON.stringify(requestBody, null, 2)} \n  query: ${JSON.stringify(query, null, 4)}`;
  }

  protected createResponseLog(request: Request, response: ServerResponse, responseBody: Record<string, any>) {
    const { url, method } = request;
    const bodyString = JSON.stringify(responseBody, null, 2);
    if (bodyString && bodyString.length) {
      const bodyToLog = bodyString.length > 300 ? `${bodyString.slice(0, 300)} ... ${bodyString.length - 300} more characters` : bodyString;
      return `RESPONSE ${method} ${url} ${response.statusCode} ---> \n  body: ${bodyToLog}`;
    }

    return `RESPONSE ${method} ${url} ${response.statusCode}`;
  }

  protected maskProperties(body: Record<string, any>) {
    const maskedBody: ObjectLiteral = Object.assign({}, body);
    for (const key of this.maskedProperties) {
      if (maskedBody[key]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        maskedBody[key] = maskedBody[key].toString().replace(/./g, '*');
      }
    }
    return maskedBody;
  }
}
