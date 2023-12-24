import StrategyBase, { StrategyResponse } from '@app/auth/strategies/StrategyBase';
import { SocialProfileEntity } from '@app/entities/SocialProfileEntity';
import { userFromCode } from '@app/services/google/googleOAuth2Client';
import { Request } from 'express';

export type GoogleStrategyConfig = {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes: string[];
};

export default class GoogleStrategy implements StrategyBase<GoogleStrategyConfig> {
    config: GoogleStrategyConfig;

    constructor(config: GoogleStrategyConfig) {
        this.config = config;
    }

    async userFromRequest(req: Request): Promise<StrategyResponse> {
        const { code } = req.query;
        if (!code) {
            return {
                error: new Error('GoogleStrategy is missing code from Request Query'),
            };
        }

        try {
            const { user: userPayload, error } = await userFromCode(String(code));
            if (error) {
                throw error;
            }
            if (!userPayload) {
                throw new Error('Unable to get user payload from Google');
            }
            const user = await SocialProfileEntity.getUserFromPartial({
                provider: 'google',
                provider_uid: userPayload.id,
                name: userPayload.name,
                email: userPayload.email,
                email_verified: userPayload.email_verified,
                profile_img_url: userPayload.profile_img_url,
                tokens: userPayload.tokens as Record<string, unknown>,
            });

            return { user };
        } catch (error) {
            return { error: error as Error };
        }
    }
}
