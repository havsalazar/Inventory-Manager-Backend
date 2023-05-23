import { QueryRunner } from "typeorm";
import { Logger } from "typeorm"
import { Logger as ConsoleLogger } from '@nestjs/common';

export class CustomDatabaseLog implements Logger {
    private readonly logger = new ConsoleLogger("database");

    async logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
        const type = query.split(' ')[0].toUpperCase()
        // this.logger.log(query)
        const queryTypes={
            'INSERT':true, 
            'UPDATE':true,
            'DELETE':true, 
        }
        if (queryTypes[type]){
            const table = query.split('"')[1]
            this.logger.log(type )
            this.logger.log(table )
            this.logger.log(query )             
        }
    }
    logMigration(message: string, queryRunner?: QueryRunner) {
        
    }
    logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        
    }
    log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner) {
        // this.logger.log(level)
    }
    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        
    }
    logSchemaBuild(message: string, queryRunner?: QueryRunner) {
        
    }
}
