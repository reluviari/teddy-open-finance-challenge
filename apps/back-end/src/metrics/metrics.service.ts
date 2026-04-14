import { Injectable } from '@nestjs/common';

/** Collects and formats basic application metrics in Prometheus exposition format. */
@Injectable()
export class MetricsService {
  private readonly startTime = Date.now();
  private requestCount = 0;
  private errorCount = 0;

  /** Increments the total request counter. */
  incrementRequests(): void {
    this.requestCount++;
  }

  /** Increments the total error counter. */
  incrementErrors(): void {
    this.errorCount++;
  }

  /** Returns all metrics as a Prometheus-formatted string. */
  getMetrics(): string {
    const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const memoryUsage = process.memoryUsage();

    const lines = [
      '# HELP app_uptime_seconds Application uptime in seconds',
      '# TYPE app_uptime_seconds gauge',
      `app_uptime_seconds ${uptimeSeconds}`,
      '',
      '# HELP app_requests_total Total number of HTTP requests',
      '# TYPE app_requests_total counter',
      `app_requests_total ${this.requestCount}`,
      '',
      '# HELP app_errors_total Total number of HTTP errors',
      '# TYPE app_errors_total counter',
      `app_errors_total ${this.errorCount}`,
      '',
      '# HELP app_memory_rss_bytes Resident set size in bytes',
      '# TYPE app_memory_rss_bytes gauge',
      `app_memory_rss_bytes ${memoryUsage.rss}`,
      '',
      '# HELP app_memory_heap_used_bytes Heap used in bytes',
      '# TYPE app_memory_heap_used_bytes gauge',
      `app_memory_heap_used_bytes ${memoryUsage.heapUsed}`,
      '',
      '# HELP app_memory_heap_total_bytes Heap total in bytes',
      '# TYPE app_memory_heap_total_bytes gauge',
      `app_memory_heap_total_bytes ${memoryUsage.heapTotal}`,
    ];

    return lines.join('\n') + '\n';
  }
}
