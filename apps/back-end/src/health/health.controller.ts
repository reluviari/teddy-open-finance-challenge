import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/** Exposes health check endpoints for infrastructure monitoring. */
@ApiTags('health')
@Controller()
export class HealthController {
  /** Returns current health status with a timestamp. */
  @Get('healthz')
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy', schema: { properties: { status: { type: 'string', example: 'ok' }, timestamp: { type: 'string', example: '2026-04-15T00:00:00.000Z' } } } })
  check(): { status: string; timestamp: string } {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
