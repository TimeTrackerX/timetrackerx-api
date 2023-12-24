import { authConfig } from '@app/config/modules/authConfig';
import { cacheConfig } from '@app/config/modules/cacheConfig';
import { databaseConfig } from '@app/config/modules/databaseConfig';
import '@app/config/modules/queueConfig';
import { serverConfig } from '@app/config/modules/serverConfig';

const appConfig = {
    server: serverConfig,
    database: databaseConfig,
    auth: authConfig,
    cache: cacheConfig,
};

export default appConfig;
