import Env from '@app/utils/Env';

export const authConfig = {
    jwtSecret: Env.asString('JWT_SECRET'),
    testUserEmail: Env.asString('TEST_USER_EMAIL'),
    strategies: {},
};
