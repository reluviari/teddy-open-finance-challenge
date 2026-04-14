import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getDatabaseConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: process.env['DATABASE_HOST'] || 'localhost',
    port: parseInt(process.env['DATABASE_PORT'] || '5432', 10),
    username: process.env['DATABASE_USER'] || 'teddy',
    password: process.env['DATABASE_PASSWORD'] || 'teddy',
    database: process.env['DATABASE_NAME'] || 'teddy',
    autoLoadEntities: true,
    synchronize: false,
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsRun: true,
  };
}
