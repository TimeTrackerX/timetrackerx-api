import CustomLogger from '@app/database/core/CustomLogger';
import Env from '@app/utils/Env';
import * as path from 'path';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const databaseUrlString = Env.asString('DATABASE_URL');
const databaseUrl = new URL(databaseUrlString);
const { hostname, port, username, password, pathname } = databaseUrl;

const currentDir = import.meta.dir;
const entitiesPath = path.join(currentDir, '..', '..', 'entities', '*Entity.{js,ts}');
const migrationsPath = path.join(currentDir, '..', '..', 'database', 'migrations', '*.{js,ts}');
const subscribersPath = path.join(currentDir, '..', '..', 'database', 'subscribers', '*.{js,ts}');

export const databaseConfig: MysqlConnectionOptions = {
    type: 'mariadb',
    charset: 'utf8mb4_unicode_ci',
    host: hostname,
    port: Number(port),
    username,
    password,
    database: pathname.slice(1),
    entities: [entitiesPath],
    synchronize: Env.asBoolean('DATABASE_SYNC', false),
    logging: Env.asBoolean('DATABASE_LOG', false),
    logger: new CustomLogger(),
    cache: {
        type: 'database',
        tableName: 'tbl_caches',
    },
    subscribers: [subscribersPath],
    migrationsTableName: 'tbl_migrations',
    migrations: [migrationsPath],
    migrationsRun: true,
};
