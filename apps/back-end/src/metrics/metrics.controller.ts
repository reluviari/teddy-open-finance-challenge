import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProduces } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';

/** Exposes application metrics in Prometheus exposition format. */
@ApiTags('metrics')
@Controller()
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  /** Returns metrics in Prometheus text format. */
  @Get('metrics')
  @ApiOperation({ summary: 'Application metrics (Prometheus format)' })
  @ApiProduces('text/plain')
  @Header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
  getMetrics(): string {
    return this.metricsService.getMetrics();
  }
}
