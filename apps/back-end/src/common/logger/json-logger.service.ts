import { ConsoleLogger } from '@nestjs/common';

/** NestJS logger that outputs structured JSON to stdout. */
export class JsonLoggerService extends ConsoleLogger {
  log(message: string, context?: string): void {
    process.stdout.write(this.formatEntry('info', message, context));
  }

  error(message: string, trace?: string, context?: string): void {
    process.stderr.write(this.formatEntry('error', message, context, trace));
  }

  warn(message: string, context?: string): void {
    process.stdout.write(this.formatEntry('warn', message, context));
  }

  debug(message: string, context?: string): void {
    process.stdout.write(this.formatEntry('debug', message, context));
  }

  verbose(message: string, context?: string): void {
    process.stdout.write(this.formatEntry('verbose', message, context));
  }

  private formatEntry(level: string, message: string, context?: string, trace?: string): string {
    const entry: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      level,
      context: context ?? this.context ?? 'App',
      message,
    };

    if (trace) {
      entry.trace = trace;
    }

    return JSON.stringify(entry) + '\n';
  }
}
