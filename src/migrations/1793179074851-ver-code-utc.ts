import type { MigrationInterface, QueryRunner } from 'typeorm';

export class VerCodeUtc1793179074851 implements MigrationInterface {
  name = 'VerCodeUtc1793179074851';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "verification-code" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification-code" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "verification-code" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification-code" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }
}
