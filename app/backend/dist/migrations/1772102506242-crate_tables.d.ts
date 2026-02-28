import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CrateTables1772102506242 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
