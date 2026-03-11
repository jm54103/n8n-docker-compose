"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrateTables1773252259771 = void 0;
class CrateTables1773252259771 {
    constructor() {
        this.name = 'CrateTables1773252259771';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_sessions" ALTER COLUMN "refreshTokenHash" DROP NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_sessions" ALTER COLUMN "refreshTokenHash" SET NOT NULL`);
    }
}
exports.CrateTables1773252259771 = CrateTables1773252259771;
//# sourceMappingURL=1773252259771-crate_tables.js.map