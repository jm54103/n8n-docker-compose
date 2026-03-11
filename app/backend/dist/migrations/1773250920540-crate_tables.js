"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrateTables1773250920540 = void 0;
class CrateTables1773250920540 {
    constructor() {
        this.name = 'CrateTables1773250920540';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_by" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updated_by" DROP NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updated_by" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_by" SET NOT NULL`);
    }
}
exports.CrateTables1773250920540 = CrateTables1773250920540;
//# sourceMappingURL=1773250920540-crate_tables.js.map