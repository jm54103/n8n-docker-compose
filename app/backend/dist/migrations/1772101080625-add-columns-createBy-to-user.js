"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddColumnsCreateByToUser1772101080625 = void 0;
class AddColumnsCreateByToUser1772101080625 {
    constructor() {
        this.name = 'AddColumnsCreateByToUser1772101080625';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user_groups" ("groupId" SERIAL NOT NULL, "group_name" character varying(50) NOT NULL, "description" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_8c88a1da05e26c473ea0c96c945" UNIQUE ("group_name"), CONSTRAINT "PK_4dcea3f5c6f04650517d9dc4750" PRIMARY KEY ("groupId"))`);
        await queryRunner.query(`CREATE TABLE "users" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "password_hash" character varying NOT NULL, "group_id" integer, "is_active" boolean NOT NULL DEFAULT true, "status" character varying(20) NOT NULL DEFAULT 'ACTIVE', "is_logged_in" boolean NOT NULL DEFAULT false, "session_key" text, "login_attempts" integer NOT NULL DEFAULT '0', "lock_until" TIMESTAMP WITH TIME ZONE, "last_login" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying(100) NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying(100) NOT NULL, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_b8d62b3714f81341caa13ab0ff0" FOREIGN KEY ("group_id") REFERENCES "user_groups"("groupId") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_b8d62b3714f81341caa13ab0ff0"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_groups"`);
    }
}
exports.AddColumnsCreateByToUser1772101080625 = AddColumnsCreateByToUser1772101080625;
//# sourceMappingURL=1772101080625-add-columns-createBy-to-user.js.map