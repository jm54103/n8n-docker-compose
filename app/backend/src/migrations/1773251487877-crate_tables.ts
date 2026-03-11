import { MigrationInterface, QueryRunner } from "typeorm";

export class CrateTables1773251487877 implements MigrationInterface {
    name = 'CrateTables1773251487877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_sessions" ("sessionId" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "refreshTokenHash" character varying NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "deviceInfo" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f1d56cb09724333a500af7fe914" PRIMARY KEY ("sessionId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_sessions"`);
    }

}
