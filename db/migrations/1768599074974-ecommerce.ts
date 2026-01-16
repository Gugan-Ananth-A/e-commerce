import { MigrationInterface, QueryRunner } from "typeorm";

export class Ecommerce1768599074974 implements MigrationInterface {
    name = 'Ecommerce1768599074974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product-image" ("id" SERIAL NOT NULL, "image_url" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "productId" integer, CONSTRAINT "PK_c6db6eaddc596c5b041b89c3a2b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "price" integer NOT NULL, "stock" integer NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order-item" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_e06b16183c1f2f8b09f359ed572" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "role" character varying NOT NULL, "total_price" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" integer, "orderItemsId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying, "role" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_token" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "user_id" integer, CONSTRAINT "REL_6bbe63d2fe75e7f0ba1710351d" UNIQUE ("user_id"), CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_categories_category" ("productId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_17f2a361443184000ee8d79f240" PRIMARY KEY ("productId", "categoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_342d06dd0583aafc156e076379" ON "product_categories_category" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_15520e638eb4c46c4fb2c61c4b" ON "product_categories_category" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "product-image" ADD CONSTRAINT "FK_e0d3aac975dac94ca36615b6ab3" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_8cffdcf6c68ba3ec5af2ea91cc8" FOREIGN KEY ("orderItemsId") REFERENCES "order-item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_categories_category" ADD CONSTRAINT "FK_342d06dd0583aafc156e0763790" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_categories_category" ADD CONSTRAINT "FK_15520e638eb4c46c4fb2c61c4b4" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_categories_category" DROP CONSTRAINT "FK_15520e638eb4c46c4fb2c61c4b4"`);
        await queryRunner.query(`ALTER TABLE "product_categories_category" DROP CONSTRAINT "FK_342d06dd0583aafc156e0763790"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_8cffdcf6c68ba3ec5af2ea91cc8"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
        await queryRunner.query(`ALTER TABLE "product-image" DROP CONSTRAINT "FK_e0d3aac975dac94ca36615b6ab3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_15520e638eb4c46c4fb2c61c4b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_342d06dd0583aafc156e076379"`);
        await queryRunner.query(`DROP TABLE "product_categories_category"`);
        await queryRunner.query(`DROP TABLE "refresh_token"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "order-item"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "product-image"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
