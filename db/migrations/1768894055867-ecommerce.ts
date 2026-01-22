import { MigrationInterface, QueryRunner } from "typeorm";

export class Ecommerce1768894055867 implements MigrationInterface {
    name = 'Ecommerce1768894055867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "tokenVersion" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tokenVersion"`);
    }

}
