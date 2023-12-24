import Env from '@app/utils/Env';

const googleConfig: GoogleStrategyConfig = {
    clientId: Env.asString('GOOGLE_CLIENT_ID'),
    clientSecret: Env.asString('GOOGLE_CLIENT_SECRET'),
    redirectUri: Env.asString('GOOGLE_REDIRECT_URI'),
    scopes: Env.asArrayOfStrings('GOOGLE_SCOPES'),
};

export const authConfig = {
    jwtSecret: Env.asString('JWT_SECRET'),
    testUserEmail: Env.asString('TEST_USER_EMAIL'),
    strategies: {},
    configs: {
        google: googleConfig,
    },
};
