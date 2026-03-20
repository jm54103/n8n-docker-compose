import { MigrationInterface, QueryRunner } from "typeorm";

export class CrateTables1774019036793 implements MigrationInterface {
    name = 'CrateTables1774019036793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_groups" ("groupId" SERIAL NOT NULL, "group_name" character varying(50) NOT NULL, "description" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_8c88a1da05e26c473ea0c96c945" UNIQUE ("group_name"), CONSTRAINT "PK_4dcea3f5c6f04650517d9dc4750" PRIMARY KEY ("groupId"))`);
        await queryRunner.query(`CREATE TABLE "users" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "password_hash" character varying NOT NULL, "group_id" integer, "is_active" boolean NOT NULL DEFAULT true, "status" character varying(20) NOT NULL DEFAULT 'ACTIVE', "is_logged_in" boolean NOT NULL DEFAULT false, "session_key" text, "login_attempts" integer NOT NULL DEFAULT '0', "lock_until" TIMESTAMP WITH TIME ZONE, "last_login" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying(100), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying(100), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "user_sessions" ("sessionId" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "refreshTokenHash" character varying, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "deviceInfo" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f1d56cb09724333a500af7fe914" PRIMARY KEY ("sessionId"))`);
        await queryRunner.query(`CREATE TABLE "user_access_logs" ("access_id" BIGSERIAL NOT NULL, "user_id" uuid, "action_type" character varying(50) NOT NULL, "ip_address" character varying(45), "user_agent" text, "session_id" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c4d954fb1912b2ca279d994ade5" PRIMARY KEY ("access_id"))`);
        await queryRunner.query(`CREATE TABLE "user_activity_logs" ("activity_id" BIGSERIAL NOT NULL, "actor_id" uuid, "action_type" character varying(50) NOT NULL, "target_table" character varying(50), "target_id" uuid, "old_value" jsonb, "new_value" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cebbae91a69f1456f573c5c7ec3" PRIMARY KEY ("activity_id"))`);
        await queryRunner.query(`CREATE TABLE "system_parameters" ("param_id" SERIAL NOT NULL, "param_key" character varying(100) NOT NULL, "param_value" text NOT NULL, "value_type" character varying(20) NOT NULL DEFAULT 'INT', "description" text, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_1a235c6aed36d882d063ca5466e" UNIQUE ("param_key"), CONSTRAINT "PK_d5aeca6131f20569d7a8d3d4b9e" PRIMARY KEY ("param_id"))`);
        await queryRunner.query(`CREATE TABLE "system_permissions" ("permission_id" SERIAL NOT NULL, "permission_key" character varying(100) NOT NULL, "permission_name" character varying(100) NOT NULL, "description" text, CONSTRAINT "UQ_6e532e2ff6791516373e1eb5b99" UNIQUE ("permission_key"), CONSTRAINT "PK_903fab76c0c81761d4bd53ac4c3" PRIMARY KEY ("permission_id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_b8d62b3714f81341caa13ab0ff0" FOREIGN KEY ("group_id") REFERENCES "user_groups"("groupId") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_access_logs" ADD CONSTRAINT "FK_7b41ba339e34c38c42d00c63862" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_activity_logs" ADD CONSTRAINT "FK_37b7f4bbb7150fbf7561d0db7a8" FOREIGN KEY ("actor_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_activity_logs" DROP CONSTRAINT "FK_37b7f4bbb7150fbf7561d0db7a8"`);
        await queryRunner.query(`ALTER TABLE "user_access_logs" DROP CONSTRAINT "FK_7b41ba339e34c38c42d00c63862"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_b8d62b3714f81341caa13ab0ff0"`);
        await queryRunner.query(`DROP TABLE "system_permissions"`);
        await queryRunner.query(`DROP TABLE "system_parameters"`);
        await queryRunner.query(`DROP TABLE "user_activity_logs"`);
        await queryRunner.query(`DROP TABLE "user_access_logs"`);
        await queryRunner.query(`DROP TABLE "user_sessions"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_groups"`);
    }

}
