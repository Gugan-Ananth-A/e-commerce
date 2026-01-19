import { MigrationInterface, QueryRunner } from "typeorm";

export class Ecommerce1768835760316 implements MigrationInterface {
    name = 'Ecommerce1768835760316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "hash" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "hash"`);
    }

}
