import { UserEntity } from '@app/entities/UserEntity';
import JwtService from '@app/services/JwtService';
import { JsonController, UnauthorizedError } from 'routing-controllers';

@JsonController('/auth')
export default class AuthController {
    renderAuthSuccess(user: UserEntity) {
        const token = JwtService.fromUser(user);

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                avatar: user.avatar_url_prefix + 'png',
            },
        };
    }

    throwAuthError(e: Error) {
        const { message } = e as Error;
        throw new UnauthorizedError(message);
    }
}
