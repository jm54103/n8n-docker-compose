"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrateTables1772102506242 = void 0;
class CrateTables1772102506242 {
    constructor() {
        this.name = 'CrateTables1772102506242';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user_access_logs" ("access_id" BIGSERIAL NOT NULL, "user_id" uuid, "action_type" character varying(50) NOT NULL, "ip_address" character varying(45), "user_agent" text, "session_id" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c4d954fb1912b2ca279d994ade5" PRIMARY KEY ("access_id"))`);
        await queryRunner.query(`CREATE TABLE "user_activity_logs" ("activity_id" BIGSERIAL NOT NULL, "actor_id" uuid, "action_type" character varying(50) NOT NULL, "target_table" character varying(50), "target_id" uuid, "old_value" jsonb, "new_value" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cebbae91a69f1456f573c5c7ec3" PRIMARY KEY ("activity_id"))`);
        await queryRunner.query(`CREATE TABLE "system_parameters" ("param_id" SERIAL NOT NULL, "param_key" character varying(100) NOT NULL, "param_value" text NOT NULL, "value_type" character varying(20) NOT NULL DEFAULT 'INT', "description" text, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_1a235c6aed36d882d063ca5466e" UNIQUE ("param_key"), CONSTRAINT "PK_d5aeca6131f20569d7a8d3d4b9e" PRIMARY KEY ("param_id"))`);
        await queryRunner.query(`CREATE TABLE "system_permissions" ("permission_id" SERIAL NOT NULL, "permission_key" character varying(100) NOT NULL, "permission_name" character varying(100) NOT NULL, "description" text, CONSTRAINT "UQ_6e532e2ff6791516373e1eb5b99" UNIQUE ("permission_key"), CONSTRAINT "PK_903fab76c0c81761d4bd53ac4c3" PRIMARY KEY ("permission_id"))`);
        await queryRunner.query(`ALTER TABLE "user_access_logs" ADD CONSTRAINT "FK_7b41ba339e34c38c42d00c63862" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_activity_logs" ADD CONSTRAINT "FK_37b7f4bbb7150fbf7561d0db7a8" FOREIGN KEY ("actor_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_activity_logs" DROP CONSTRAINT "FK_37b7f4bbb7150fbf7561d0db7a8"`);
        await queryRunner.query(`ALTER TABLE "user_access_logs" DROP CONSTRAINT "FK_7b41ba339e34c38c42d00c63862"`);
        await queryRunner.query(`DROP TABLE "system_permissions"`);
        await queryRunner.query(`DROP TABLE "system_parameters"`);
        await queryRunner.query(`DROP TABLE "user_activity_logs"`);
        await queryRunner.query(`DROP TABLE "user_access_logs"`);
    }
}
exports.CrateTables1772102506242 = CrateTables1772102506242;
//# sourceMappingURL=1772102506242-crate_tables.js.map