import { DbLogger } from '@app/utils/loggers';
import { AbstractLogger, LogLevel, LogMessage, QueryRunner } from 'typeorm';

export default class CustomLogger extends AbstractLogger {
    protected writeLog(
        level: LogLevel,
        message: LogMessage | string | number | (LogMessage | string | number)[],
        queryRunner?: QueryRunner,
    ): void {
        switch (level) {
            case 'info':
                DbLogger.info(message);
                break;

            case 'error':
                DbLogger.error(message);
                break;

            case 'warn':
                DbLogger.warn(message);
                break;

            default:
                DbLogger.info(message);
        }
    }
}
