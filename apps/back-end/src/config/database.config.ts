import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getDatabaseConfig(): TypeOrmModuleOptions {
  const databaseUrl = process.env['DATABASE_URL'];

  const baseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    autoLoadEntities: true,
    synchronize: false,
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsRun: true,
  };

  if (databaseUrl) {
    return {
      ...baseConfig,
      url: databaseUrl,
      ssl: { rejectUnauthorized: false },
    };
  }

  return {
    ...baseConfig,
    host: process.env['DATABASE_HOST'] || 'localhost',
    port: parseInt(process.env['DATABASE_PORT'] || '5432', 10),
    username: process.env['DATABASE_USER'] || 'teddy',
    password: process.env['DATABASE_PASSWORD'] || 'teddy',
    database: process.env['DATABASE_NAME'] || 'teddy',
  };
}
