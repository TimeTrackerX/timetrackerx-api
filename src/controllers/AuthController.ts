import StrategyBase from '@app/auth/strategies/StrategyBase';
import { UserEntity } from '@app/entities/UserEntity';
import JwtService from '@app/services/JwtService';
import { Request } from 'express';
import { JsonController, UnauthorizedError } from 'routing-controllers';

@JsonController('/auth')
export default class AuthController {
    protected async userFromRequest(strategy: StrategyBase, req: Request) {
        let authError: Error | undefined = undefined;
        try {
            const { user, error } = await strategy.userFromRequest(req);
            if (user) {
                return this.renderAuthSuccess(user);
            }
            authError = error || new Error('Unknown Error');
        } catch (e) {
            authError = e as Error;
        }

        this.throwAuthError(authError);
    }

    protected renderAuthSuccess(user: UserEntity) {
        const token = JwtService.fromUser(user);

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                avatar: user.profile_img_url,
            },
        };
    }

    protected throwAuthError(e: Error) {
        const { message } = e as Error;
        throw new UnauthorizedError(message);
    }
}
