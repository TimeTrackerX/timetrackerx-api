import StrategyBase from '@app/auth/strategies/StrategyBase';
import { UserEntity } from '@app/entities/UserEntity';
import { TokenRefresh } from '@app/forms/TokenRefresh';
import JwtService from '@app/services/JwtService';
import { Request } from 'express';
import { BadRequestError, Body, JsonController, Post, UnauthorizedError } from 'routing-controllers';

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

    @Post('/refresh-token')
    async refreshToken(@Body({ validate: true }) payload: TokenRefresh) {
        const { token, refreshToken } = payload;
        const id = JwtService.getUserIdFromRefreshToken(token, refreshToken);
        if (!id) {
            throw new BadRequestError('Unable to retrieve user id from refresh token');
        }
        const user = await UserEntity.findOneBy({ id });
        if (!user) {
            throw new BadRequestError('Unable to retrieve user from refresh token');
        }

        return user.toJwtResponse();
    }
}
