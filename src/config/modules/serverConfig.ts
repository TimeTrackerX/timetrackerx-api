import Env from '@app/utils/Env';

const baseUrlString = Env.asString('BASE_URL');
const baseUrl = new URL(baseUrlString);

export const serverConfig = {
    https: baseUrl.protocol === 'https:',
    hostname: baseUrl.hostname,
    port: Number(baseUrl.port),
    baseUrl: baseUrl.origin,
};
