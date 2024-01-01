import appConfig from '@app/config';
import { UserEntity } from '@app/entities/UserEntity';
import JwtService from '@app/services/JwtService';
import Env from '@app/utils/Env';
import { Action } from 'routing-controllers';
import { AuthorizationChecker } from 'routing-controllers/types/AuthorizationChecker';
import { CurrentUserChecker } from 'routing-controllers/types/CurrentUserChecker';

const getTokenFromAction = (action: Action): string | null => {
    const authorizationHeader: string | undefined = action.request.headers['authorization'];
    if (authorizationHeader) {
        return authorizationHeader.split('Bearer ').pop() || null;
    }
    return action.request.query['token'] || null;
};

const getUserFromToken = (token: string): Promise<UserEntity | boolean> => {
    if (Env.isDev() && token === 'TEST_TOKEN') {
        return UserEntity.findOneByOrFail({ email: appConfig.auth.testUserEmail });
    }

    return UserEntity.fromJwtToken(token);
};

export const currentUserChecker: CurrentUserChecker = async (action: Action) => {
    const token = getTokenFromAction(action);
    if (!token) {
        return null;
    }
    return JwtService.isValid(token) ? await getUserFromToken(token) : null;
};

export const authorizationChecker: AuthorizationChecker = async (action: Action, roles: string[]) => {
    const token = getTokenFromAction(action);
    if (!token) {
        return false;
    }
    return JwtService.isValid(token) ? !!(await getUserFromToken(token)) : false;
};
