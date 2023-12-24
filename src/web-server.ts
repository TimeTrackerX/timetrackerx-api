import 'reflect-metadata';
import { AppDataSource } from '@app/database/data-source';
import { serverStart } from '@app/server';
import { AppLogger } from '@app/utils/loggers';

AppDataSource.initialize()
    .then(() => serverStart())
    .then(msg => AppLogger.info(msg))
    .catch(error => AppLogger.error(error));
