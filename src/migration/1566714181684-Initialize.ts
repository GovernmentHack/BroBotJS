import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialize1566714181684 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `message_log_entry` (`id` int NOT NULL AUTO_INCREMENT, `messageString` text NOT NULL, `messageLinks` text NOT NULL, `triggerMessage` text NOT NULL, `timeStamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `message_log_entry`");
    }

}
