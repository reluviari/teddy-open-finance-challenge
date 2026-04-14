import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

/** Exposes health check endpoints for infrastructure monitoring. */
@ApiTags('health')
@Controller()
export class HealthController {
  /** Returns current health status with a timestamp. */
  @Get('healthz')
  @ApiOperation({ summary: 'Health check' })
  check(): { status: string; timestamp: string } {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
