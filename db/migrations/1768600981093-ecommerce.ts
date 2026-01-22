import { MigrationInterface, QueryRunner } from "typeorm";

export class Ecommerce1768600981093 implements MigrationInterface {
    name = 'Ecommerce1768600981093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" RENAME COLUMN "role" TO "status"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" RENAME COLUMN "status" TO "role"`);
    }

}
