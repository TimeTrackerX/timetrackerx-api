import appConfig from '@app/config';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { get } from 'lodash';
export type UserPayload = {
    id: string;
    email: string;
    email_verified: boolean;
    name: string;
    profile_img_url?: string;
    tokens: Credentials;
};

export const buildClient = (): OAuth2Client =>
    new OAuth2Client({
        clientId: appConfig.auth.configs.google.clientId,
        clientSecret: appConfig.auth.configs.google.clientSecret,
        redirectUri: appConfig.auth.configs.google.redirectUri,
    });

export const buildAuthorizeUrl = (client: OAuth2Client = buildClient()) => {
    return client.generateAuthUrl({
        access_type: 'offline',
        scope: appConfig.auth.configs.google.scopes,
    });
};

export const userFromCode = async (
    code: string,
    client: OAuth2Client = buildClient(),
): Promise<{ user?: UserPayload; error?: Error }> => {
    try {
        const { tokens } = await client.getToken(code);
        const { id_token, access_token, refresh_token } = tokens;
        if (!id_token) {
            throw new Error('Missing id_token');
        }
        if (!access_token) {
            throw new Error('Missing access_token');
        }
        if (!refresh_token) {
            throw new Error('Missing refresh_token');
        }
        const loginTicket = await client.verifyIdToken({
            idToken: id_token,
        });

        const payload = loginTicket.getPayload();
        if (!payload) {
            throw new Error('Missing payload');
        }
        const { sub: id, email, name, picture: profile_img_url, email_verified } = payload;
        return {
            user: {
                id,
                email: email || '',
                email_verified: email_verified === true,
                name: name || '',
                profile_img_url,
                tokens,
            },
        };
    } catch (e) {
        const errorMsg = get(e, 'response.data.error') || get(e, 'message');
        return { error: new Error(`Unable to get user info due to: ${errorMsg}`) };
    }
};
