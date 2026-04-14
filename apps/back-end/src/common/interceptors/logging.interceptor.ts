import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Request } from 'express';
import { MetricsService } from '../../metrics/metrics.service';

/** Logs structured JSON for every HTTP request and feeds metrics counters. */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  constructor(private readonly metricsService?: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const start = Date.now();

    this.metricsService?.incrementRequests();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        this.logger.log(JSON.stringify({ method, url, duration: `${duration}ms` }));
      }),
      catchError((err) => {
        this.metricsService?.incrementErrors();
        const duration = Date.now() - start;
        this.logger.error(JSON.stringify({ method, url, duration: `${duration}ms`, error: true }));
        return throwError(() => err);
      }),
    );
  }
}
