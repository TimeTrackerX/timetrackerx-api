import StrategyBase, { StrategyResponse } from '@app/auth/strategies/StrategyBase';
import { SocialProfileEntity, SocialProfileLookUp } from '@app/entities/SocialProfileEntity';
import { Request } from 'express';
import { OAuth2Client } from 'google-auth-library';

export type GoogleStrategyConfig = {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes: string[];
};

export default class GoogleStrategy implements StrategyBase<GoogleStrategyConfig> {
    config: GoogleStrategyConfig;
    client: OAuth2Client;

    constructor(config: GoogleStrategyConfig) {
        this.config = config;
        this.client = new OAuth2Client(this.config);
    }

    recreateClientForPostMessage() {
        this.client = new OAuth2Client({
            ...this.config,
            redirectUri: 'postmessage',
        });
    }
    async userFromRequest(req: Request): Promise<StrategyResponse> {
        const { code: codeQueryString, prompt } = req.query;
        if (!codeQueryString) {
            return {
                error: new Error('GoogleStrategy is missing code from Request Query'),
            };
        }
        const code = String(codeQueryString);
        if (!prompt) {
            this.recreateClientForPostMessage();
        }
        try {
            const socialProfileLookUp = await this.userFromCode(code);

            const user = await SocialProfileEntity.getUserFromPartial(socialProfileLookUp);

            return { user };
        } catch (error) {
            return { error: error as Error };
        }
    }

    protected async userFromCode(code: string): Promise<SocialProfileLookUp> {
        const { tokens } = await this.client.getToken(code);
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
        const loginTicket = await this.client.verifyIdToken({
            idToken: id_token,
        });

        const payload = loginTicket.getPayload();
        if (!payload) {
            throw new Error('Missing payload');
        }
        const { sub: id, email, name, picture: profile_img_url, email_verified } = payload;
        return {
            provider: 'google',
            provider_uid: id,
            email: email || '',
            email_verified: email_verified === true,
            name: name || '',
            profile_img_url,
            tokens: tokens as Record<string, unknown>,
        };
    }
}
