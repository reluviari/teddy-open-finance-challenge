import { MetricsService } from './metrics.service';

describe('MetricsService', () => {
  let service: MetricsService;

  beforeEach(() => {
    service = new MetricsService();
  });

  describe('getMetrics', () => {
    it('should return Prometheus-formatted string', () => {
      const actual = service.getMetrics();

      expect(actual).toContain('# HELP app_uptime_seconds');
      expect(actual).toContain('# TYPE app_uptime_seconds gauge');
      expect(actual).toContain('app_uptime_seconds');
      expect(actual).toContain('app_requests_total 0');
      expect(actual).toContain('app_errors_total 0');
      expect(actual).toContain('app_memory_rss_bytes');
      expect(actual).toContain('app_memory_heap_used_bytes');
    });
  });

  describe('incrementRequests', () => {
    it('should increment request counter', () => {
      service.incrementRequests();
      service.incrementRequests();

      const actual = service.getMetrics();

      expect(actual).toContain('app_requests_total 2');
    });
  });

  describe('incrementErrors', () => {
    it('should increment error counter', () => {
      service.incrementErrors();

      const actual = service.getMetrics();

      expect(actual).toContain('app_errors_total 1');
    });
  });
});
