"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrateTables1773251487877 = void 0;
class CrateTables1773251487877 {
    constructor() {
        this.name = 'CrateTables1773251487877';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user_sessions" ("sessionId" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "refreshTokenHash" character varying NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "deviceInfo" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f1d56cb09724333a500af7fe914" PRIMARY KEY ("sessionId"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "user_sessions"`);
    }
}
exports.CrateTables1773251487877 = CrateTables1773251487877;
//# sourceMappingURL=1773251487877-crate_tables.js.map