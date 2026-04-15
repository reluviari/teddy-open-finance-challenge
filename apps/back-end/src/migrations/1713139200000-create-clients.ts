import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateClients1713139200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'clients',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'name', type: 'varchar' },
          { name: 'email', type: 'varchar', isNullable: true },
          { name: 'salary', type: 'decimal', precision: 12, scale: 2 },
          { name: 'companyValue', type: 'decimal', precision: 12, scale: 2 },
          { name: 'viewCount', type: 'int', default: 0 },
          { name: 'createdAt', type: 'timestamptz', default: 'now()' },
          { name: 'updatedAt', type: 'timestamptz', default: 'now()' },
          { name: 'deletedAt', type: 'timestamptz', isNullable: true },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('clients');
  }
}
