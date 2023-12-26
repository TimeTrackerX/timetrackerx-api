import StrategyBase from '@app/auth/strategies/StrategyBase';
import { Request } from 'express';
import { JsonController, UnauthorizedError } from 'routing-controllers';

@JsonController('/auth')
export default class AuthController {
    protected async userFromRequest(strategy: StrategyBase, req: Request) {
        let authError: Error | undefined = undefined;
        try {
            const { user, error } = await strategy.userFromRequest(req);
            if (user) {
                return user.toJwtResponse();
            }
            authError = error || new Error('Unknown Error');
        } catch (e) {
            authError = e as Error;
        }

        throw new UnauthorizedError(authError.message);
    }
}
