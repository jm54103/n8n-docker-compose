import { MigrationInterface, QueryRunner } from "typeorm";

export class CrateTables1773252259771 implements MigrationInterface {
    name = 'CrateTables1773252259771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_sessions" ALTER COLUMN "refreshTokenHash" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_sessions" ALTER COLUMN "refreshTokenHash" SET NOT NULL`);
    }

}
