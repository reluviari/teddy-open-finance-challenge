import { JwtModuleOptions } from '@nestjs/jwt';

export function getJwtConfig(): JwtModuleOptions {
  const expiresIn = process.env['JWT_EXPIRES_IN'] || '1h';

  return {
    secret: process.env['JWT_SECRET'] || 'change-me-in-production',
    signOptions: {
      expiresIn: expiresIn as unknown as number,
    },
  };
}
