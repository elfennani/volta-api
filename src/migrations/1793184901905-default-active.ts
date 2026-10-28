import type { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultActive1793184901905 implements MigrationInterface {
    name = 'DefaultActive1793184901905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verification-code" ALTER COLUMN "active" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verification-code" ALTER COLUMN "active" SET DEFAULT false`);
    }

}
